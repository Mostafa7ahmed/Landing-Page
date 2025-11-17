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

  project = {
    id: '1',
    title: 'عنوان المشروع',
    intro: 'مقدمة قصيرة عن المشروع تشرح فكرته وفوائده بشكل موجز وجذاب.',
    description:
      'هذا وصف تفصيلي للمشروع يوضح الأهداف، التحديات، الحلول التقنية، وقيمة المشروع للمستخدمين والعملاء. يتضمن ذلك بنية النظام، واجهات المستخدم، الاعتبارات الأمنية، وخطط التوسع المستقبلية.',
    cover: 'Image/genisis.png',
    screenshots: ['Image/genisis.png', 'Image/hero.jpg', 'Image/genisis.png', 'Image/hero.jpg'],
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
    website: '#',
    download: '#',
    steps: [
      { step: 1, title: 'التحليل والمتطلبات', text: 'جمع وتحليل المتطلبات وفهم احتياجات أصحاب المصلحة.' },
      { step: 2, title: 'التصميم', text: 'تصميم واجهات المستخدم والبنية التقنية للمشروع.' },
      { step: 3, title: 'التطوير', text: 'بناء المكونات وتطبيق المنهجيات السليمة مع اختبارات مبدئية.' },
      { step: 4, title: 'الاختبار والإطلاق', text: 'اختبارات شاملة وتحسينات نهائية ثم الإطلاق والمتابعة.' }
    ]
  };

  ngAfterViewInit(): void {
    AOS.init({ duration: 800, once: true, easing: 'ease-in-out' });
    this.route.paramMap.subscribe(p => {
      const id = p.get('id');
      if (id) this.project.id = id;
    });
  }
}
