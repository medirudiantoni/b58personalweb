const upload_image = document.getElementById("upload_image");
const image_preview = document.getElementById("image_preview");
const image_url_getter = document.getElementById("image_url_getter");

upload_image.addEventListener("change", (e) => {
  const file = e.target.files[0];
  const fileUrl = URL.createObjectURL(file);
  image_preview.setAttribute("src", fileUrl);
  image_url_getter.setAttribute("value", fileUrl);
  console.log(fileUrl);
});