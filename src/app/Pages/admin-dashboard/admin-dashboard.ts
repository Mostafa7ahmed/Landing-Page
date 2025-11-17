import { AfterViewInit, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormControl } from '@angular/forms';
import * as AOS from 'aos';

interface Project {
  id: string;
  title: string;
  description: string;
  image: string; // base64 or url
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

  private readonly STORAGE_KEY = 'admin_projects';

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      image: ['', [Validators.required]],
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

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files && input.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      this.form.get('image')?.setValue(base64);
    };
    reader.readAsDataURL(file);
  }

  submit(): void {
    if (this.form.invalid) return;

    const value = this.form.value as Omit<Project, 'id'>;

    if (this.editingId) {
      const idx = this.projects.findIndex(p => p.id === this.editingId);
      if (idx > -1) {
        this.projects[idx] = { id: this.editingId, ...value };
      }
    } else {
      const id = Date.now().toString();
      this.projects.unshift({ id, ...value });
    }

    this.saveProjects();
    this.resetForm();
  }

  edit(p: Project): void {
    this.editingId = p.id;
    this.form.patchValue({
      title: p.title,
      description: p.description,
      image: p.image,
      link: p.link || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancelEdit(): void {
    this.resetForm();
  }

  delete(p: Project): void {
    const ok = confirm('هل أنت متأكد من حذف هذا المشروع؟');
    if (!ok) return;
    this.projects = this.projects.filter(x => x.id !== p.id);
    this.saveProjects();
  }

  trackById(_index: number, item: Project): string {
    return item.id;
  }

  private resetForm(): void {
    this.form.reset();
    this.editingId = null;
  }

  private loadProjects(): void {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      if (raw) {
        this.projects = JSON.parse(raw) as Project[];
      } else {
        // seed with few examples to start with
        this.projects = [
          {
            id: '1',
            title: 'منصة تجارة إلكترونية',
            description: 'منصة احترافية تدعم الدفع الإلكتروني وإدارة المنتجات والمخزون والتحليلات.',
            image: 'Image/genisis.png',
            link: '#'
          },
          {
            id: '2',
            title: 'تطبيق حجوزات',
            description: 'تطبيق لحجز المواعيد وإدارة الجداول مع إشعارات فورية وتقويم متكامل.',
            image: 'Image/hero.jpg',
            link: '#'
          },
          {
            id: '3',
            title: 'نظام إدارة مهام',
            description: 'لوحة مهام مع تتبع تقدم الأعمال، مهام فرعية، وتعليقات وإرفاق ملفات.',
            image: 'Image/genisis.png',
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
