// --- 1. DỮ LIỆU ---
const travelDatabase = {
    "LongAn": {
        tenTinh: "Long An",
        locations: [
            { name: "Di tích Ngã ba Đức Hòa", status: true },
            { name: "Cánh đồng bất tận", status: false },
            { name: "Di tích Nhà Trăm cột", status: false }

        ]
    },
    "DaNang": {
        tenTinh: "Đà Nẵng",
        locations: [
            { name: "Cầu Rồng", status: false },
            { name: "Bà Nà Hills", status: false },
            { name: "Bán đảo Sơn Trà (Bảo trì)", status: false }
        ]
    }
};

// --- 2. XỬ LÝ SLIDESHOW ---
const containers = document.querySelectorAll('.slideshow-container');
containers.forEach(container => {
    let slideIdx = 0;
    const slides = container.querySelectorAll('.slide');
    if (slides.length === 0) return;

    function show(n) {
        slides.forEach(s => s.style.display = "none");
        slideIdx = (n + slides.length) % slides.length;
        slides[slideIdx].style.display = "block";
    }

    let autoSlide = setInterval(() => { slideIdx++; show(slideIdx); }, 4000);
    show(0);

    const prevBtn = container.querySelector('.prev');
    const nextBtn = container.querySelector('.next');
    if (prevBtn) prevBtn.onclick = () => { show(--slideIdx); clearInterval(autoSlide); };
    if (nextBtn) nextBtn.onclick = () => { show(++slideIdx); clearInterval(autoSlide); };
});

// --- 3. LOGIC CHỌN TỈNH & ĐỊA ĐIỂM ---
const provinceSelect = document.getElementById('provinceSelect');
const locationSelect = document.getElementById('locationSelect');
const btnStart = document.getElementById('btnStart');

function loadProvinces() {
    if (!provinceSelect) return;
    for (const key in travelDatabase) {
        const option = document.createElement('option');
        option.value = key;
        option.text = travelDatabase[key].tenTinh;
        provinceSelect.appendChild(option);
    }
}

if (provinceSelect) {
    provinceSelect.onchange = function() {
        locationSelect.innerHTML = '<option value="">-- Chọn địa điểm --</option>';
        if (!this.value) {
            locationSelect.disabled = true;
            return;
        }

        const locations = travelDatabase[this.value].locations;
        locations.forEach(loc => {
            const option = document.createElement('option');
            option.value = loc.name;
            option.text = loc.name + (loc.status ? "" : " (Đóng cửa)");
            
            // LOGIC QUAN TRỌNG: Khóa địa điểm nếu status là false
            if (!loc.status) {
                option.disabled = true;
            }
            
            locationSelect.appendChild(option);
        });
        locationSelect.disabled = false;
    };
}

// --- 4. MODAL & LIGHTBOX ---
function showModal(msg) {
    const modal = document.getElementById('customModal');
    if (!modal) return;
    document.getElementById('modalMessage').innerText = msg;
    modal.style.display = "flex";
}

function closeModal() {
    document.getElementById('customModal').style.display = "none";
}

function openLightbox(src) {
    const lb = document.getElementById('Lightbox');
    if (!lb) return;
    document.getElementById('LightboxImg').src = src;
    lb.style.display = 'flex';
}

function closeLightbox() {
    document.getElementById('Lightbox').style.display = 'none';
}

// Đóng modal/lightbox khi click ra ngoài
window.onclick = function(e) {
    const modal = document.getElementById('customModal');
    const lb = document.getElementById('Lightbox');
    if (e.target == modal) closeModal();
    if (e.target == lb) closeLightbox();
};

// --- 5. ĐIỀU HƯỚNG ---
if (btnStart) {
    btnStart.onclick = function() {
        if (!provinceSelect.value || !locationSelect.value) {
            showModal("Vui lòng chọn đầy đủ thông tin!");
            return;
        }
        const url = `main.html?tinh=${provinceSelect.value}&place=${encodeURIComponent(locationSelect.value)}`;
        window.location.href = url;
    };
}

// Tự động điền tiêu đề nếu ở trang main.html
const params = new URLSearchParams(window.location.search);
const placeName = params.get('place');
if (placeName && document.getElementById('placeTitle')) {
    document.getElementById('placeTitle').innerText = placeName;
}

loadProvinces();