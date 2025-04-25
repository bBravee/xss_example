const form = document.getElementById("xss-form");
const contentInput = document.getElementById("content");
const commentsList = document.getElementById("comments");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const content = contentInput.value;
  await fetch("/comments", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content }),
  });
  contentInput.value = "";
  loadComments();
});

async function loadComments() {
  const res = await fetch("/comments");
  const comments = await res.json();
  commentsList.innerHTML = "";
  comments.forEach(({ id, content }) => {
    const p = document.createElement("p");
    p.innerHTML = `<div>${content}</div>`;
    commentsList.appendChild(p);
  });
}

loadComments();
