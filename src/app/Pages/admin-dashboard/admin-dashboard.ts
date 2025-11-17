import { AfterViewInit, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormControl } from '@angular/forms';
import * as AOS from 'aos';

declare const Swal: any;
declare const bootstrap: any;

interface Project {
  id: string;
  title: string;
  description: string;
  cover: string; // base64 or url
  gallery: string[]; // additional images
  link?: string;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.scss'
})
export class AdminDashboard implements OnInit, AfterViewInit {
  form: FormGroup;
  searchControl = new FormControl('', { nonNullable: true });

  projects: Project[] = [];
  editingId: string | null = null;
  private projectModal: any = null;

  private readonly STORAGE_KEY = 'admin_projects';

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      cover: ['', [Validators.required]],
      gallery: [[]],
      link: ['']
    });
  }

  ngOnInit(): void {
    this.loadProjects();
  }

  ngAfterViewInit(): void {
    if (AOS) {
      AOS.init({ duration: 800, once: true, easing: 'ease-in-out' });
    }
  }

  get filteredProjects(): Project[] {
    const q = (this.searchControl.value || '').toLowerCase().trim();
    if (!q) return this.projects;
    return this.projects.filter(p =>
      p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
    );
  }

  onCoverSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files && input.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      this.form.get('cover')?.setValue(base64);
    };
    reader.readAsDataURL(file);
  }

  onGallerySelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = input.files;
    if (!files || files.length === 0) return;

    const existing: string[] = (this.form.get('gallery')?.value || []) as string[];
    const readers: Promise<string>[] = [];
    for (let i = 0; i < files.length; i++) {
      const f = files[i];
      readers.push(new Promise<string>((resolve) => {
        const r = new FileReader();
        r.onload = () => resolve(r.result as string);
        r.readAsDataURL(f);
      }));
    }
    Promise.all(readers).then(base64s => {
      this.form.get('gallery')?.setValue([...existing, ...base64s]);
    });
  }

  submit(): void {
    if (this.form.invalid) return;

    const value = this.form.value as Omit<Project, 'id'>;

    if (this.editingId) {
      const idx = this.projects.findIndex(p => p.id === this.editingId);
      if (idx > -1) {
        this.projects[idx] = { id: this.editingId, ...value } as Project;
      }
      this.saveProjects();
      this.closeProjectModal();
      if (typeof Swal !== 'undefined') {
        Swal.fire({
          title: 'تم التحديث',
          text: 'تم تحديث بيانات المشروع بنجاح',
          icon: 'success',
          confirmButtonText: 'حسناً'
        });
      }
    } else {
      const id = Date.now().toString();
      this.projects.unshift({ id, ...value } as Project);
      this.saveProjects();
      this.closeProjectModal();
      if (typeof Swal !== 'undefined') {
        Swal.fire({
          title: 'تمت الإضافة',
          text: 'تم إضافة المشروع بنجاح',
          icon: 'success',
          confirmButtonText: 'حسناً'
        });
      }
    }
    this.resetForm();
  }

  edit(p: Project): void {
    this.editingId = p.id;
    this.form.patchValue({
      title: p.title,
      description: p.description,
      cover: p.cover,
      gallery: p.gallery || [],
      link: p.link || ''
    });
    this.openProjectModal();
  }

  cancelEdit(): void {
    this.resetForm();
    this.closeProjectModal();
  }

  delete(p: Project): void {
    if (typeof Swal !== 'undefined') {
      Swal.fire({
        title: 'هل أنت متأكد؟',
        text: 'لن تتمكن من التراجع عن هذه العملية',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'نعم، احذف',
        cancelButtonText: 'إلغاء'
      }).then((result: any) => {
        if (result.isConfirmed) {
          this.projects = this.projects.filter(x => x.id !== p.id);
          this.saveProjects();
          Swal.fire({ title: 'تم الحذف', text: 'تم حذف المشروع بنجاح', icon: 'success', confirmButtonText: 'حسناً' });
        }
      });
    } else {
      const ok = confirm('هل أنت متأكد من حذف هذا المشروع؟');
      if (!ok) return;
      this.projects = this.projects.filter(x => x.id !== p.id);
      this.saveProjects();
    }
  }

  trackById(_index: number, item: Project): string {
    return item.id;
  }

  private resetForm(): void {
    this.form.reset();
    this.editingId = null;
  }

  removeGalleryImage(index: number): void {
    const g: string[] = (this.form.get('gallery')?.value || []) as string[];
    g.splice(index, 1);
    this.form.get('gallery')?.setValue([...g]);
  }

  openAddModal(): void {
    this.resetForm();
    this.openProjectModal();
  }

  private openProjectModal(): void {
    const el = document.getElementById('projectModal');
    if (!el || typeof bootstrap === 'undefined') return;
    this.projectModal = new bootstrap.Modal(el, { backdrop: 'static', keyboard: false });
    this.projectModal.show();
    setTimeout(() => {
      try {
        if (AOS && typeof (AOS as any).refreshHard === 'function') {
          (AOS as any).refreshHard();
        } else if (AOS && typeof (AOS as any).refresh === 'function') {
          (AOS as any).refresh();
        }
      } catch {}
    }, 50);
  }

  private closeProjectModal(): void {
    if (this.projectModal) {
      this.projectModal.hide();
    }
  }

  private loadProjects(): void {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as any[];
        // migrate older schema (image -> cover, ensure gallery)
        this.projects = parsed.map((p: any) => {
          const cover = p.cover ?? p.image ?? '';
          const gallery = Array.isArray(p.gallery) ? p.gallery : [];
          const migrated: Project = {
            id: String(p.id ?? Date.now()),
            title: p.title ?? '',
            description: p.description ?? '',
            cover,
            gallery,
            link: p.link ?? undefined
          };
          return migrated;
        });
        this.saveProjects();
      } else {
        // seed with few examples to start with
        this.projects = [
          {
            id: '1',
            title: 'منصة تجارة إلكترونية',
            description: 'منصة احترافية تدعم الدفع الإلكتروني وإدارة المنتجات والمخزون والتحليلات.',
            cover: 'Image/genisis.png',
            gallery: ['Image/genisis.png', 'Image/hero.jpg'],
            link: '#'
          },
          {
            id: '2',
            title: 'تطبيق حجوزات',
            description: 'تطبيق لحجز المواعيد وإدارة الجداول مع إشعارات فورية وتقويم متكامل.',
            cover: 'Image/hero.jpg',
            gallery: ['Image/hero.jpg', 'Image/genisis.png'],
            link: '#'
          },
          {
            id: '3',
            title: 'نظام إدارة مهام',
            description: 'لوحة مهام مع تتبع تقدم الأعمال، مهام فرعية، وتعليقات وإرفاق ملفات.',
            cover: 'Image/genisis.png',
            gallery: ['Image/genisis.png'],
            link: '#'
          }
        ];
        this.saveProjects();
      }
    } catch {
      this.projects = [];
    }
  }

  private saveProjects(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.projects));
  }
}
