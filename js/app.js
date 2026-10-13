class App {
  constructor() {
    this.coursesManager = new CoursesManager();
    this.storageManager = new StorageManager();
    this.progress = this.storageManager.getProgress();
    this.favorites = this.storageManager.getFavorites();
    this.init();
  }

  async init() {
    await this.coursesManager.loadData();
    this.updateStats();
    this.renderRoadmap();
    this.setupEventListeners();
    this.setupIntersectionObserver();
  }

  updateStats() {
    const stats = this.coursesManager.getStats();
    const elements = {
      tracks: document.getElementById('stat-tracks'),
      stages: document.getElementById('stat-stages'),
      courses: document.getElementById('stat-courses'),
      verified: document.getElementById('stat-verified')
    };
    if (elements.tracks) {
      elements.tracks.textContent = stats.totalTracks;
      elements.tracks.classList.add('count-up');
    }
    if (elements.stages) {
      elements.stages.textContent = stats.totalStages;
      elements.stages.classList.add('count-up');
    }
    if (elements.courses) {
      elements.courses.textContent = stats.totalCourses;
      elements.courses.classList.add('count-up');
    }
    if (elements.verified) {
      elements.verified.textContent = stats.totalCourses;
      elements.verified.classList.add('count-up');
    }
  }

  renderRoadmap() {
    const container = document.getElementById('roadmap-container');
    if (!container || !this.coursesManager.roadmap) return;

    let html = '';
    for (const track of this.coursesManager.roadmap.tracks) {
      html += `
        <section class="track-section fade-in" data-track="${track.id}">
          <div class="track-header" style="border-color: ${track.color}">
            <h2 class="track-title">${track.name}</h2>
            <p class="track-description">${track.description}</p>
          </div>
          <div class="stages-container">
      `;
      for (const stage of track.stages) {
        const courses = this.coursesManager.getCoursesByStage(stage.id);
        html += `
          <article class="stage-card slide-in-right" data-stage="${stage.id}">
            <button class="stage-toggle" aria-expanded="false" data-stage-id="${stage.id}">
              <div class="stage-header-content">
                <h3 class="stage-title">${stage.title}</h3>
                <span class="stage-count">${courses.length} دورة</span>
              </div>
              <svg class="stage-chevron" width="20" height="20" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </button>
            <div class="stage-content" style="display: none;">
              <div class="stage-topics">
                <ul class="topics-list">
        `;
        for (const topic of stage.topics) {
          html += `<li class="topic-item">${topic}</li>`;
        }
        html += `
                </ul>
              </div>
              <div class="stage-courses">
                ${courses.length === 0 ? `
                  <div class="no-courses">
                    <p>لا توجد دورة مناسبة مؤكدة في الكتالوج الحالي لهذه المرحلة.</p>
                    <p class="no-courses-note">يمكن إضافة دورات عند توفر بيانات مؤكدة.</p>
                  </div>
                ` : ''}
                ${courses.map(course => this.renderCourseCard(course, track)).join('')}
              </div>
            </div>
          </article>
        `;
      }
      html += `
          </div>
        </section>
      `;
    }
    container.innerHTML = html;

    this.bindStageToggles();
  }

  renderCourseCard(course, track) {
    const isFavorite = this.favorites.includes(course.id);
    const isCompleted = this.progress.completedCourses.includes(course.id);
    return `
      <div class="course-card ${isCompleted ? 'completed' : ''}" data-course-id="${course.id}">
        <div class="course-header">
          <h4 class="course-title">${escapeHtml(course.title)}</h4>
          ${course.sourceVerified ? '<span class="badge badge-verified" title="تم التحقق من الرابط">✓ تم التحقق</span>' : ''}
          ${isFavorite ? '<span class="badge badge-fav">★ مفضلة</span>' : ''}
        </div>
        <p class="course-description">${escapeHtml(course.description || '')}</p>
        <div class="course-meta">
          <span class="meta-item">المستوى: ${course.level || 'غير محدد'}</span>
          <span class="meta-item">السعر: ${course.priceLabel || course.accessType || 'غير محدد'}</span>
        </div>
        <div class="course-tags">
          ${(course.tags || []).map(t => `<span class="tag">${escapeHtml(t)}</span>`).join('')}
        </div>
        <div class="course-actions">
          <a href="${course.officialUrl}" target="_blank" rel="noopener noreferrer" class="btn-sm btn-sm-primary">
            عرض الكورس الأصلي
          </a>
          <button class="btn-sm btn-sm-ghost" data-action="details" data-course-id="${course.id}">
            التفاصيل
          </button>
          <button class="btn-sm btn-sm-ghost" data-action="toggle-complete" data-course-id="${course.id}">
            ${isCompleted ? 'إلغاء الإنجاز' : 'تم الإنجاز'}
          </button>
          <button class="btn-sm btn-sm-ghost" data-action="toggle-fav" data-course-id="${course.id}">
            ${isFavorite ? 'إزالة من المفضلة' : 'إضافة للمفضلة'}
          </button>
        </div>
      </div>
    `;
  }

  bindStageToggles() {
    document.querySelectorAll('.stage-toggle').forEach(btn => {
      btn.addEventListener('click', () => {
        const stageId = btn.dataset.stageId;
        const content = btn.nextElementSibling;
        const expanded = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', !expanded);
        content.style.display = expanded ? 'none' : 'block';
        // Animate chevron
        const chevron = btn.querySelector('.stage-chevron');
        if (chevron) {
          chevron.style.transform = expanded ? 'rotate(0deg)' : 'rotate(180deg)';
        }
      });
    });
  }

  setupEventListeners() {
    document.getElementById('start-journey')?.addEventListener('click', () => {
      document.getElementById('roadmap')?.scrollIntoView({ behavior: 'smooth' });
    });
    document.getElementById('explore-paths')?.addEventListener('click', () => {
      document.getElementById('roadmap')?.scrollIntoView({ behavior: 'smooth' });
    });
  }

  setupIntersectionObserver() {
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 });
      document.querySelectorAll('.fade-in, .slide-in-right').forEach(el => {
        observer.observe(el);
      });
    } else {
      document.querySelectorAll('.fade-in, .slide-in-right').forEach(el => {
        el.classList.add('visible');
      });
    }
  }
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

document.addEventListener('DOMContentLoaded', () => {
  new App();
});
