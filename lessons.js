const lessonList = document.querySelector('#lessons');
const lessonStatus = document.querySelector('#lesson-status');
const resources = [
  ['recording', 'Recording'],
  ['slides', 'Slides'],
  ['homework', 'Homework'],
  ['solutions', 'Solutions'],
];

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
  for (const [key, label] of resources) {
    const url = lesson[key];
    if (typeof url === 'string' && /^https:\/\//i.test(url.trim())) {
      const link = document.createElement('a');
      link.href = url.trim();
      link.textContent = label;
      link.setAttribute('aria-label', label + ' for ' + lesson.lesson);
      links.append(link);
    } else {
      const placeholder = document.createElement('span');
      placeholder.className = 'pending';
      placeholder.textContent = label + ' coming soon';
      links.append(placeholder);
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
