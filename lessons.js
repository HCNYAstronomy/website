const lessonList = document.querySelector('#lessons');
const lessonStatus = document.querySelector('#lesson-status');
const resources = [
  ['recording', 'Recording'],
  ['slides', 'Slides'],
  ['homework', 'Homework'],
  ['solutions', 'Solutions'],
];

function resourceUrl(value) {
  if (typeof value !== 'string') return '';
  const url = value.trim();
  if (/^https:\/\//i.test(url)) return url;

  const path = url.replace(/^\.\//, '');
  const filename = path.startsWith('pdfs/') ? path.slice(5) : '';
  if (!filename || /[/\\]/.test(filename) || !/\.pdf$/i.test(filename)) return '';
  return './pdfs/' + encodeURIComponent(filename);
}

function renderLesson(lesson) {
  const item = document.createElement('li');
  item.className = 'lesson';
  const heading = document.createElement('p');
  heading.className = 'lesson-heading';
  const name = document.createElement('strong');
  name.textContent = lesson.lesson;
  const topic = document.createElement('span');
  topic.className = 'lesson-topic';
  topic.textContent = lesson.topic;
  heading.append(name, topic);

  const links = document.createElement('p');
  links.className = 'resources';
  const slides = document.createElement('span');
  for (const [key, label] of resources) {
    const group = key === 'slides' || key === 'pptx' ? slides : links;
    if (key === 'slides') links.append(slides);
    const url = resourceUrl(lesson[key]);
    if (download && !url) continue;
    if (url) {
      const link = document.createElement('a');
      link.href = url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.textContent = label;
      link.setAttribute('aria-label', label + ' for ' + lesson.lesson + ' (opens in a new tab)');
      group.append(link);
    } else {
      const placeholder = document.createElement('span');
      placeholder.className = 'pending';
      placeholder.textContent = label;
      placeholder.title = label + ' coming soon';
      group.append(placeholder);
    }
  }
  item.append(heading, links);
  return item;
}

async function loadLessons() {
  try {
    const response = await fetch('./lessons.json', { cache: 'no-cache' });
    if (!response.ok) throw new Error('Unable to fetch lessons.');
    const lessons = await response.json();
    lessonList.replaceChildren(...lessons.map(renderLesson));
    lessonStatus.textContent = lessons.length ? '' : 'Lessons will be posted here.';
    lessonStatus.hidden = lessons.length > 0;
  } catch {
    lessonStatus.textContent = 'Lesson materials could not be loaded. Please refresh to try again.';
  }
}

loadLessons();
