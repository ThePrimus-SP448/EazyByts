/* common.js - shared JS for pages
   Responsibilities:
   - load/save portfolio data to localStorage (key: portfolioData_v1)
   - apply background image and profile photo
   - setup and handle mobile hamburger menu
   - set active nav link
*/

const STORAGE_KEY = "portfolioData_v1";

/* default data */
const defaultData = {
  name: "Your Name",
  tagline: "Aspiring Web Developer • Building portfolios",
  socials: { linkedin: "", github: "", twitter: "" },
  resume: "",
  background: "loginbd3.jpg", // default background image (use the file you've uploaded)
  profilePhoto: "", // dataURL
  skills: ["HTML", "CSS", "JavaScript"],
  projects: [{ id: genId(), title: "Portfolio UI", description: "Responsive portfolio using HTML/CSS/JS" }],
  experience: [{ id: genId(), role: "Intern", company: "Company", period: "2025", details: "Worked on frontend" }],
  blog: [{ id: genId(), title: "Started Web Dev", excerpt: "My first steps...", content: "I began learning..." }]
};

function genId(){ return "id_" + Math.random().toString(36).slice(2,9); }

function saveData(obj){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
}

function loadData(){
  const raw = localStorage.getItem(STORAGE_KEY);
  if(!raw){
    saveData(defaultData);
    return JSON.parse(JSON.stringify(defaultData));
  }
  try{
    return JSON.parse(raw);
  }catch(e){
    console.error("Corrupt storage, resetting.", e);
    saveData(defaultData);
    return JSON.parse(JSON.stringify(defaultData));
  }
}

/* apply data to current page: background, name, tagline, socials, resume, profile photo */
function applyCommonData(){
  const data = loadData();

  // background
  const bg = document.getElementById("bg-image");
  if(bg) {
    bg.style.backgroundImage = `url("${data.background || 'loginbd3.jpg'}")`;
  }

  // header name and tagline
  const headerName = document.getElementById("header-name");
  if(headerName) headerName.textContent = data.name || defaultData.name;

  const taglineEls = document.querySelectorAll("[data-portfolio-tagline]");
  taglineEls.forEach(e => e.textContent = data.tagline || defaultData.tagline);

  // portfolio name placeholders
  document.querySelectorAll("[data-portfolio-name]").forEach(e => e.textContent = data.name || defaultData.name);

  // socials link elements
  const socialsMap = { linkedin: ".link-linkedin", github: ".link-github", twitter: ".link-twitter" };
  Object.keys(socialsMap).forEach(key => {
    const sel = socialsMap[key];
    document.querySelectorAll(sel).forEach(a => {
      if(a.tagName !== 'A') return;
      if(data.socials && data.socials[key]){
        a.href = data.socials[key];
        a.style.opacity = 1;
      } else {
        a.removeAttribute("href");
        a.style.opacity = 0.6;
      }
    });
  });

  // resume links
  document.querySelectorAll(".resume-link").forEach(a=>{
    if(a.tagName!=='A') return;
    if(data.resume){ a.href = data.resume; a.style.opacity = 1; } else { a.removeAttribute("href"); a.style.opacity = 0.6; }
  });

  // profile photo rendering (fills elements with id profileAvatar or img with id profile-photo)
  renderProfilePhoto();
}

/* renderProfilePhoto: supports a div#profileAvatar or img#profile-photo */
function renderProfilePhoto(){
  const data = loadData();
  const photo = data.profilePhoto;
  const avatarDiv = document.getElementById("profileAvatar");
  const avatarImg = document.getElementById("profile-photo");
  const initials = (data.name || "").split(" ").map(s => s[0]).slice(0,2).join("").toUpperCase() || "U";

  if(avatarImg){
    if(photo){
      avatarImg.src = photo;
      avatarImg.style.display = "block";
      avatarImg.style.borderRadius = "50%";
    } else {
      avatarImg.style.display = "none";
    }
  }
  if(avatarDiv){
    if(photo){
      avatarDiv.style.backgroundImage = `url("${photo}")`;
      avatarDiv.style.backgroundSize = "cover";
      avatarDiv.style.backgroundPosition = "center";
      avatarDiv.textContent = "";
    } else {
      avatarDiv.style.backgroundImage = "";
      avatarDiv.textContent = initials;
      avatarDiv.style.display = "flex";
      avatarDiv.style.justifyContent = "center";
      avatarDiv.style.alignItems = "center";
      avatarDiv.style.fontSize = "36px";
      avatarDiv.style.fontWeight = "700";
    }
  }
}

/* Hamburger / mobile menu logic */
function setupHamburger(){
  const burger = document.getElementById("hamburger");
  const mobileNav = document.getElementById("mobile-nav");
  if(!burger || !mobileNav) return;

  function closeMenu(){
    mobileNav.classList.remove("open");
  }

  burger.addEventListener("click", (e)=>{
    e.stopPropagation();
    mobileNav.classList.toggle("open");
  });

  // close when clicking outside
  document.addEventListener("click", (e)=>{
    if(!mobileNav.contains(e.target) && !burger.contains(e.target)){
      closeMenu();
    }
  });

  // close when clicking a link inside mobile nav
  mobileNav.querySelectorAll("a").forEach(a => a.addEventListener("click", ()=> closeMenu()));
}

/* set active link based on filename */
function setActiveNav(){
  const path = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav a").forEach(a=>{
    const href = a.getAttribute("href");
    if(!href) return;
    if(href === path) a.classList.add("active");
    else a.classList.remove("active");
  });
}

/* init on DOM ready */
document.addEventListener("DOMContentLoaded", ()=>{
  applyCommonData();
  setupHamburger();
  setActiveNav();
});
