// Home project section
function deleteProject(id) {
  const confirmToDelete = confirm(
    "Are you sure you want to delete this project"
  );
  if (confirmToDelete) {
    window.location.href = `/project-delete/${id}`;
  }
}