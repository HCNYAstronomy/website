const lessonList = document.querySelector('#lessons');
const lessonStatus = document.querySelector('#lesson-status');
const resources = [
  ['recording', 'Recording'],
  ['slides', 'Slides'],
  ['pptx', '(pptx)'],
  ['homework', 'Homework'],
  ['solutions', 'Solutions'],
];

function resourceUrl(value, download) {
  if (typeof value !== 'string') return '';
  const url = value.trim();
  if (!download && /^https:\/\//i.test(url)) return url;

  const path = url.replace(/^\.\//, '');
  const match = download
    ? /^(pptxs|pdfs)\/([^/\\]+\.pptx)$/i.exec(path)
    : /^(pdfs)\/([^/\\]+\.pdf)$/i.exec(path);
  return match ? './' + match[1] + '/' + encodeURIComponent(match[2]) : '';
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
  links.style.display = 'grid';
  links.style.gridTemplateColumns = 'repeat(auto-fit, minmax(min(100%, 6rem), 1fr))';
  const slides = document.createElement('span');
  slides.style.whiteSpace = 'nowrap';
  for (const [key, label] of resources) {
    const group = key === 'slides' || key === 'pptx' ? slides : links;
    if (key === 'slides') links.append(slides);
    const download = key === 'pptx';
    if (download) slides.append(' ');
    const url = resourceUrl(lesson[key], download);
    if (url) {
      const link = document.createElement('a');
      link.href = url;
      if (download) {
        link.download = '';
      } else {
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
      }
      link.textContent = label;
      link.setAttribute('aria-label', label + ' for ' + lesson.lesson + (download ? ' (downloads PowerPoint)' : ' (opens in a new tab)'));
      group.append(link);
    } else {
      const placeholder = document.createElement('span');
      placeholder.className = 'pending';
      placeholder.textContent = label;
      placeholder.style.fontSize = 'inherit';
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
