const testimonials = [
    {
        name: "Lê Đức Mạnh",
        text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text.",
        image: "https://images2.thanhnien.vn/528068263637045248/2024/1/25/e093e9cfc9027d6a142358d24d2ee350-65a11ac2af785880-17061562929701875684912.jpg"
    },
    {
        name: "Vũ Nhật Minh",
        text: "The service was exceptional! I couldn't be happier with the results. They really understood what I was looking for and delivered beyond my expectations.",
        image: "https://photo.znews.vn/w660/Uploaded/mdf_eioxrd/2021_07_06/2.jpg"
    },
    {
        name: "Nguyễn Ngọc Anh",
        text: "I've tried many similar products, but this one stands out for its quality and durability. The customer support team was also incredibly helpful.",
        image: "https://hoanghamobile.com/tin-tuc/wp-content/uploads/2023/07/anh-dep-thien-nhien-thump.jpg"
    },
    {
        name: "Kiều Thanh Hiếu",
        text: "I've tried many similar products, but this one stands out for its quality and durability. The customer support team was also incredibly helpful.",
        image: "https://dulichviet.com.vn/images/bandidau/danh-sach-nhung-buc-anh-viet-nam-lot-top-anh-dep-the-gioi.jpg"
    },
    {
        name: "Trần Văn Toàn",
        text: "What impressed me most was the attention to detail. Every aspect of the service exceeded my expectations.",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRIpFcu373Qcx5paxS3u1efEAVL9hu7VDEesQ&s"
    }
];

const carouselTrack = document.getElementById('carouselTrack');
const pagination = document.getElementById('pagination');
let currentIndex = 0;

function renderTestimonials() {
    // Clone last and first for infinite loop
    const fullList = [testimonials[testimonials.length - 1], ...testimonials, testimonials[0]];

    fullList.forEach(testimonial => {
        const card = document.createElement('div');
        card.className = 'testimonial-card';
        card.innerHTML = `
            <img src="${testimonial.image}" alt="${testimonial.name}" class="avatar">
            <h3 class="client-name">${testimonial.name}</h3>
            <p class="testimonial-text">${testimonial.text}</p>
        `;
        carouselTrack.appendChild(card);
    });

    testimonials.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.className = 'dot';
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => moveToSlide(index));
        pagination.appendChild(dot);
    });

    carouselTrack.style.transform = `translateX(-100%)`;
}

function updatePagination(index) {
    document.querySelectorAll('.dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
    });
}

function moveToSlide(index) {
    currentIndex = index;
    carouselTrack.style.transition = 'transform 0.5s ease-in-out';
    carouselTrack.style.transform = `translateX(-${(index + 1) * 100}%)`;
    updatePagination(index);
}

function nextSlide() {
    currentIndex++;
    carouselTrack.style.transition = 'transform 0.5s ease-in-out';
    carouselTrack.style.transform = `translateX(-${(currentIndex + 1) * 100}%)`;
    if (currentIndex >= testimonials.length) {
        setTimeout(() => {
            carouselTrack.style.transition = 'none';
            carouselTrack.style.transform = `translateX(-100%)`;
            currentIndex = 0;
            updatePagination(currentIndex);
        }, 500);
    } else {
        updatePagination(currentIndex);
    }
}

function prevSlide() {
    currentIndex--;
    carouselTrack.style.transition = 'transform 0.5s ease-in-out';
    carouselTrack.style.transform = `translateX(-${(currentIndex + 1) * 100}%)`;
    if (currentIndex < 0) {
        setTimeout(() => {
            carouselTrack.style.transition = 'none';
            currentIndex = testimonials.length - 1;
            carouselTrack.style.transform = `translateX(-${(currentIndex + 1) * 100}%)`;
            updatePagination(currentIndex);
        }, 500);
    } else {
        updatePagination(currentIndex);
    }
}

document.getElementById('prevBtn').addEventListener('click', prevSlide);
document.getElementById('nextBtn').addEventListener('click', nextSlide);

renderTestimonials();