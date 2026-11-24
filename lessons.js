const tableBody = document.querySelector('#lessons');
const resources = [
  ['recording', 'Watch recording'],
  ['slides', 'View slides'],
  ['homework', 'Open homework'],
  ['solutions', 'View solutions'],
];

function showMessage(message) {
  tableBody.replaceChildren();
  const cell = tableBody.insertRow().insertCell();
  cell.colSpan = 6;
  cell.textContent = message;
}

function renderLesson(lesson) {
  const row = document.createElement('tr');
  const name = document.createElement('th');
  name.scope = 'row';
  name.textContent = lesson.lesson;
  row.append(name);
  row.insertCell().textContent = lesson.topic;

  for (const [key, label] of resources) {
    const cell = row.insertCell();
    const url = lesson[key];
    if (typeof url === 'string' && /^https:\/\//i.test(url.trim())) {
      const link = document.createElement('a');
      link.href = url.trim();
      link.textContent = label;
      link.setAttribute('aria-label', label + ' for ' + lesson.lesson);
      cell.append(link);
    } else {
      cell.className = 'pending';
      cell.textContent = 'Coming soon';
    }
  }
  return row;
}

async function loadLessons() {
  try {
    const response = await fetch('./lessons.json', { cache: 'no-cache' });
    if (!response.ok) throw new Error('Unable to fetch lessons.');
    const lessons = await response.json();
    if (lessons.length === 0) {
      showMessage('Lessons will be posted here.');
      return;
    }
    tableBody.replaceChildren(...lessons.map(renderLesson));
  } catch {
    showMessage('Lesson materials could not be loaded. Please refresh to try again.');
  }
}

loadLessons();
