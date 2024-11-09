const testimonialCardWrapper = document.getElementById("testimonial-cards-wrapper")

class Testimonial {
    constructor(username, image, comment, star ){
        this.username = username;
        this.image = image;
        this.comment = comment;
        this.star = star;
    }
    renderCard(){
        return `<div class="testimonial-card">
            <img src="${this.image}" alt="${this.username}">
            <div class="text-card">
                <p>${this.comment}</p>
                <p>Rating: ${ '⭐'.repeat(this.star) }(${this.star})</p>
                <p>- ${this.username}</p>
            </div>
        </div>`
    }
};

let selectedTestimonials = "";

const getDataFromInternet = async () => {
    try {
        const result = await fetch("https://api.npoint.io/f467068f9e3e61f554c4").then(res => res.json())
        return result;
    } catch (error) {
        console.log(error)
    }
};

async function renderTestimonials(){
    if(selectedTestimonials === undefined){
        testimonialCardWrapper.innerHTML = "Failed to load data";
    }
    let testimonialCard = "";
    for (let i = 0; i < selectedTestimonials.length; i++) {
        const { username, image, comment, star } = selectedTestimonials[i];
        
        testimonialCard += new Testimonial(username, image, comment, star).renderCard();
    }
    if(selectedTestimonials.length === 0){
        testimonialCard = "Testimonials not available"
    }

    testimonialCardWrapper.innerHTML = testimonialCard;
}

async function firstLoad(){
    selectedTestimonials = await getDataFromInternet();
    renderTestimonials();
}
firstLoad()

async function selectTestimonial(star){
    const result = await getDataFromInternet();
    if(star){
        selectedTestimonials = result.filter((testi) => testi.star == star);
        renderTestimonials();
    } else {
        selectedTestimonials = result;
        renderTestimonials();
    }
}


