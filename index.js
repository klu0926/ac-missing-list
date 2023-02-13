// AC index API https://user-list.alphacamp.io/api/v1/users

// random user API doc: https://randomuser.me/documentation#howto
// random user API: https://randomuser.me/api/
// (!) add "?results={amount}" to get more results
// seed "?seed=foobar" use a seed to always get the same result


// API
const amount = 100
const seeds = "lulu"
const API = `https://randomuser.me/api/?results=${amount}&seed=${seeds}`

// Setup
let itemPerPage = 20
let currentPage = 1

// Panel
const panel = document.querySelector("#panel")
const logo = document.querySelector("#search-logo")
const lookout = document.querySelector("#lookout-link")

// Search
const searchFrom = document.querySelector("#search-from")
const input = document.querySelector("#input")
const searchBtn = document.querySelector("#search-btn")
const results = document.querySelector("#results")
// modal elements
const modalImage = document.querySelector("#modal-image")
const modalName = document.querySelector("#modal-name")
const modalRewardName = document.querySelector("#modal-reward-name")
const modalAlias = document.querySelector("#modal-alias")
const modalBirth = document.querySelector("#modal-birth")
const modalCountry = document.querySelector("#modal-country")
const modalSex = document.querySelector("#modal-sex")
const modalAge = document.querySelector("#modal-age")
const modalId = document.querySelector("#modal-id")
const modalCity = document.querySelector("#modal-city")
const modalStreet = document.querySelector("#modal-street")
const modalReward = document.querySelector("#modal-reward")
const lookoutBtn = document.querySelector("#lookout-btn")
// Pagination
const pagination = document.querySelector("#pagination")

// Model
const model = {
  data: [],

  lookoutData: [],

  toggleLookoutData(id) {
    // remove data
    const index = this.getLookoutIndex(id)
    if (index >= 0) {
      console.log("Remove data")
      this.lookoutData.splice(index, 1)
    } else {
      // add to data
      console.log("Add Data")
      const newData = this.data.find(item => item.login.uuid === id)
      this.lookoutData.push(newData)
    }
  },

  getLookoutIndex(id) {
    const index = this.lookoutData.findIndex(item => item.login.uuid === id) //string
    return index
  },

  filterSearchData(inputString, data) {
    // 檢查input 
    const input = inputString.toLowerCase().trim()
    if (!input || input.length === 0) {
      console.log("No input")
      return
    }
    // 過濾資料 
    const filterData = data.filter(item => {
      const name = (item.name.first + " " + item.name.last).toLowerCase().trim()
      if (name.includes(input)) return item
    })
    // 回傳資料
    return filterData
  },
  filterDataPerPage(page, data) {
    const startIndex = (page - 1) * (itemPerPage - 1)
    const endIndex = startIndex + itemPerPage //exclusive
    const filterData = data.slice(startIndex, endIndex)
    return filterData
  },

  generateReward(person) {
    let reward = 0
    if (person.gender === "female") {
      reward += 2000
    } else {
      reward += 500
    }

    const age = Number(person.dob.age)
    if (age <= 25) {
      reward += 10000
    } else if (age > 25 && age <= 31) {
      reward += 5000
    } else if (age > 31 && age <= 51) {
      reward += 3000
    } else if (age > 51 && age <= 61) {
      reward += 1000
    } else if (age > 61){
      reward += 100
    }
    return reward
  },

  addRewardToData(){
    this.data.forEach(person => {
      person.reward = this.generateReward(person)
    })
  },

  overrideLocalStorage(){
    const newData = JSON.stringify(this.lookoutData)
    localStorage.setItem("lookout", newData)
  }, 

  loadLocalStorage(){
    const storageData =  JSON.parse(localStorage.getItem("lookout"))
    if (!storageData || storageData.length === 0){
      return
    } else {
      this.lookoutData = storageData
    }
  },

}

// View
const view = {
  renderPanel(data) {
    // clear panel
    panel.innerHTML = ""
    // create cards
    data.forEach((item) => {
      const raw = `
      <button class="card my-3 mx-2" data-bs-toggle="modal" data-bs-target="#modal">
        <div class="img-container">
          <img src="${item.picture.large}" class="card-img card-img-blur card-img-top" data-id="${item.login.uuid}" alt="avatar">
        </div>
        <div class="d-flex justify-content-center" style="width: 100%;" data-id="${item.login.uuid}">
          <p class="card-p card-p-blur card-name m-0" data-id="${item.login.uuid}">${item.name.first} ${item.name.last}</p>
        </div>
      </button>
      `
      panel.innerHTML += raw
    })
  },
  renderLookoutCardDisplay(lookoutData) {
    // this function need to come after renderPanel()
    lookoutData.forEach(item => {
      const id = item.login.uuid
      this.showCardWithId(id)
    })
  },
  showCardWithId(id) {
    const image = document.querySelector(`img[data-id="${id}"]`)
    const text = document.querySelector(`p[data-id="${id}"]`)
    if (image && text) {
      image.classList.remove("card-img-blur")
      image.classList.add("on-lookout-img")
      text.classList.remove("card-p-blur")
      text.classList.add("on-lookout-name")
    }
  },
  blurCardWithId(id) {
    const image = document.querySelector(`img[data-id="${id}"]`)
    const text = document.querySelector(`p[data-id="${id}"]`)
    if (image && text) {
      image.classList.remove("on-lookout-img")
      image.classList.add("card-img-blur")
      text.classList.remove("on-lookout-name")
      text.classList.add("card-p-blur")
    }
  },

  renderResultNumber(data) {
    results.textContent = data.length
  },
  renderModal(data) {
    const name = `${data.name.first} ${data.name.last}`

    modalName.innerText = name
    modalRewardName.innerText = name
    modalImage.src = data.picture.large
    modalAlias.innerText = data.login.password.charAt(0).toUpperCase() + data.login.password.slice(1)
    modalBirth.innerText = data.dob.date.slice(0, 10)
    modalCountry.innerText = data.location.country
    modalSex.innerText = data.gender.charAt(0).toUpperCase() + data.gender.slice(1)
    modalAge.innerText = data.dob.age
    modalId.innerText = data.login.uuid
    modalCity.innerText = data.location.city
    modalStreet.innerText = data.location.street.name
    modalReward.innerText = `$${data.reward}`
    lookoutBtn.dataset.id = data.login.uuid

  },
  logoFadeLight() {
    logo.classList.remove("search-logo")
    logo.classList.add("search-logo-light")
  },
  logoFadeDark() {
    logo.classList.remove("search-logo-light")
    logo.classList.add("search-logo")
  },
  clearSearch() {
    input.value = ""
  },
  toggleLookoutBtnDisplay(condition) {
    // remove
    if (condition === "remove") {
      lookoutBtn.classList.remove("btn-primary")
      lookoutBtn.classList.add("btn-danger")
      lookoutBtn.innerText = "Remove"
    } else if (condition === "lookout") {
      // lookout
      lookoutBtn.classList.remove("btn-danger")
      lookoutBtn.classList.add("btn-primary")
      lookoutBtn.innerText = "Lookout"
    }
  },
  renderPagination(data) {
    const amount = data.length
    const pageAmount = Math.ceil(amount / itemPerPage)
    pagination.innerHTML = ""

    if (pageAmount < 2) return 

    for (let i = 1; i <= pageAmount; i++) {
      const raw = `
      <li class="page-item"><a class="page-link" href="#">${i}</a></li>
      `
      pagination.innerHTML += raw
    }
    this.highlightCurrentPagination()
  },
  // this call after renderPagination()
  highlightCurrentPagination(){
    const links = document.querySelectorAll(".page-item")
    links.forEach(link => {
      if (link.innerText === currentPage.toString()){
        link.classList.add("active")
      } else {
        link.classList.remove("active")
      }
    })
  },
  renderLookoutNumber(number) {
    if (Number(number) === 0) {
      lookout.innerText = "LOOKOUT"
    } else {
      lookout.innerText = `LOOKOUT(${number})`
    }
  },

}


// Control
const control = {
  getDataAndRenderPage() {
    axios.get(API)
      .then(response => {
        // 1. get Data from API
        model.data = response.data.results
        // 2. add reward to data
        model.addRewardToData()
        // 3. load local storage
        model.loadLocalStorage()
        // 3. render page 1
        this.renderPage(1, model.data)
      })
      .catch(error => {
        console.log(error)
      })
  },
  renderPage(page, data) {
    const dataPerPage = model.filterDataPerPage(page, data)
    view.renderPanel(dataPerPage)
    view.renderResultNumber(data)
    view.renderLookoutCardDisplay(model.lookoutData)
    view.renderPagination(model.data)
    view.renderLookoutNumber(model.lookoutData.length)
  },
  onCardClick(event) {
    const target = event.target
    if (target.matches(".card-img") || target.matches(".card-p")) {
      const id = target.dataset.id
      const data = model.data.find(item => item.login.uuid === id)
      view.renderModal(data)
      // render lookout btn
      if (model.getLookoutIndex(data.login.uuid) >= 0) {
        view.toggleLookoutBtnDisplay("remove")
      } else {
        view.toggleLookoutBtnDisplay("lookout")
      }
    }
  },
  onSearchButtonClick(event) {
    event.preventDefault()
    const inputValue = input.value
    // 沒有輸入
    if (!inputValue || inputValue.length === 0) {
      control.renderPage(1, model.data)
      view.renderResultNumber(model.data)
      view.renderLookoutCardDisplay(model.lookoutData)
      view.renderPagination(model.data)
    } else {
      // 有輸入
      const filterData = model.filterSearchData(inputValue, model.data)
      control.renderPage(1, filterData)
      view.renderResultNumber(filterData)
      view.renderLookoutCardDisplay(model.lookoutData)
      view.renderPagination(filterData)
    }
  },
  onLookoutBtnClick(event) {
    const target = event.target
    const id = target.dataset.id
    // toggle lookout data
    model.toggleLookoutData(id)
    // override local Storage
    model.overrideLocalStorage()
    // toggle button
    if (target.matches(".btn-primary")) {
      view.showCardWithId(id) // first
      view.toggleLookoutBtnDisplay("remove")
      view.renderLookoutNumber(model.lookoutData.length)
    } else {
      view.blurCardWithId(id) // first
      view.toggleLookoutBtnDisplay("lookout")
      view.renderLookoutNumber(model.lookoutData.length)
    }
  },
  onPaginationClick(event){
    event.preventDefault()
    const target = event.target
    if (target.matches(".page-link")){
      const page = target.innerText;
      currentPage = page
      control.renderPage(page, model.data);
    }
  },


}


// Click on card : Modal
panel.addEventListener("click", control.onCardClick)
// Search
searchBtn.addEventListener("click", control.onSearchButtonClick)
// lookout Button 
lookoutBtn.addEventListener("click", control.onLookoutBtnClick)
// Pagination
pagination.addEventListener("click", control.onPaginationClick)

// Start
control.getDataAndRenderPage()