import { AfterViewInit, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import * as AOS from 'aos';

@Component({
  selector: 'app-project-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './project-details.html',
  styleUrl: './project-details.scss'
})
export class ProjectDetails implements AfterViewInit {
  route = inject(ActivatedRoute);

  project: any = this.fallbackProject();

  ngAfterViewInit(): void {
    AOS.init({ duration: 800, once: true, easing: 'ease-in-out' });
    this.route.paramMap.subscribe(p => {
      const id = p.get('id');
      if (id) {
        this.loadProjectById(id);
      }
    });
  }

  private fallbackProject() {
    return {
      id: '1',
      title: 'عنوان المشروع',
      intro: 'مقدمة قصيرة عن المشروع تشرح فكرته وفوائده بشكل موجز وجذاب.',
      description:
        'هذا وصف تفصيلي للمشروع يوضح الأهداف، التحديات، الحلول التقنية، وقيمة المشروع للمستخدمين والعملاء. يتضمن ذلك بنية النظام، واجهات المستخدم، الاعتبارات الأمنية، وخطط التوسع المستقبلية.',
      cover: 'Image/genisis.png',
      gallery: ['Image/genisis.png', 'Image/hero.jpg', 'Image/genisis.png', 'Image/hero.jpg'],
      features: [
        'واجهة مستخدم حديثة وسهلة الاستخدام.',
        'أداء عالٍ واستجابة سريعة.',
        'دعم الوضع الليلي والاتجاه من اليمين إلى اليسار.',
        'تكامل مع واجهات برمجة تطبيقات خارجية.',
        'لوحة تحكم لإدارة المحتوى والبيانات.'
      ],
      technologies: [
        { icon: 'fab fa-angular', name: 'أنجولار' },
        { icon: 'fab fa-bootstrap', name: 'بوتستراب' },
        { icon: 'fab fa-sass', name: 'ساس' },
        { icon: 'fas fa-database', name: 'قاعدة بيانات' },
        { icon: 'fas fa-cloud', name: 'سحابة' }
      ],
      link: '#'
    };
  }

  private loadProjectById(id: string) {
    try {
      const raw = localStorage.getItem('admin_projects');
      if (!raw) {
        this.project = { ...this.fallbackProject(), id };
        return;
      }
      const list = JSON.parse(raw) as Array<{ id: string; title: string; description: string; cover: string; gallery?: string[]; link?: string }>;
      const found = list.find(p => String(p.id) === String(id));
      if (!found) {
        this.project = { ...this.fallbackProject(), id };
        return;
      }
      // hydrate details using admin shape
      const intro = (found.description || '').slice(0, 140) + ((found.description || '').length > 140 ? '…' : '');
      this.project = {
        id: found.id,
        title: found.title,
        intro,
        description: found.description,
        cover: found.cover,
        gallery: Array.isArray(found.gallery) ? found.gallery : [],
        link: found.link,
        // defaults to keep page rich
        features: [
          'واجهة مستخدم حديثة وسهلة الاستخدام.',
          'أداء عالٍ واستجابة سريعة.',
          'تكامل مع واجهات برمجة تطبيقات خارجية.'
        ],
        technologies: [
          { icon: 'fab fa-angular', name: 'أنجولار' },
          { icon: 'fab fa-bootstrap', name: 'بوتستراب' }
        ]
      };
    } catch {
      this.project = { ...this.fallbackProject(), id };
    }
  }
}
