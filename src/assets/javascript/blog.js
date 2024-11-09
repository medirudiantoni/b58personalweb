var form = document.getElementById('my-form');
var formButton = document.querySelector('#my-form button');
var blogsContainer = document.querySelector('.blogs-container');

let blogs = [];

function blogContentComponent(index, title, content, imageUrl, createdAt){
    return (
        `<div class="blog-item">
            <div class="blog-actions">
                <button class="edit-blog">Edit</button>
                <button class="delete-blog" onclick="onDeleteBlog(${index})">Delete</button>
            </div>
            <div class="image-content">
                <img src="${imageUrl}" alt="${title}" />
            </div>
            <div class="text-content">
                <div>
                    <h2>${title}</h2>
                    <p>
                        <span>${content}...</span>
                        <a href="./blog-detail.html">(selengkapnya)</a>
                    </p>
                    <p>${createdAt}</p>
                </div>
                <div>
                    <p>
                    ${getDistanceTime(blogs[index].createdAt)}
                    </p>
                </div>
            </div>
        </div>`
    )
};

function onSubmit(e){
    e.preventDefault();
    var inputTitleValue = document.getElementById('title').value;
    var inputContentValue = document.getElementById('content').value;
    var inputBlogImage = document.getElementById('input-blog-image').files;

    var blogImage = URL.createObjectURL(inputBlogImage[0]);

    const createdAt = new Date();

    const blog = {
        title: inputTitleValue,
        content: inputContentValue,
        createdAt,
        image: blogImage
    };

    blogs.unshift(blog);
    renderBlog();
    deleteBlog = document.getElementsByClassName('delete-blog');
};

function timeFormat(date){
    let jam = date.getHours();
    let menit = date.getMinutes();
    let hari = date.getDay();
    let tanggal = date.getDate();
    let bulan = date.getMonth();
    let tahun = date.getFullYear();
    let months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    let days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jum\'at', 'Sabtu'];
    let theHour = ''
    if(jam < 10){
        theHour = '0' + jam
    } else {
        theHour = jam
    }
    let theMunite = ''
    if(menit < 10){
        theMunite = '0' + menit
    } else {
        theMunite = menit
    }
    return `${days[hari]}, ${tanggal} ${months[bulan]} ${tahun} | pukul ${theHour}:${theMunite} WIB`;
}

function renderBlog(){
    let html = '';

    for(let i = 0; i < blogs.length; i++){
        let createdAt = timeFormat(blogs[i].createdAt);
        html += blogContentComponent(i, blogs[i].title, blogs[i].content, blogs[i].image, createdAt);
    };

    blogsContainer.innerHTML = html;
}

function onDeleteBlog(index){
    blogs.splice(index, 1);
    renderBlog();
    console.log(blogs)
}

form.addEventListener('submit', onSubmit);

function getDistanceTime(timePost) {
    const timeNow = new Date();
    const distance = timeNow - timePost;
  
    const seconds = Math.floor(distance / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const day = Math.floor(hours / 24);
  
    if (seconds < 60) {
      return `${seconds} seconds ago`;
    } else if (minutes < 60) {
      return `${minutes} minutes ago`;
    } else if (hours < 60) {
      return `${hours} hours ago`;
    } else if (day < 24) {
      return `${day} day ago`;
    }
  }
  
  setInterval(() => {
    renderBlog()
  }, 1000)