import React,{useEffect, useRef, useState} from 'react'
import { AiOutlineSearch } from "react-icons/ai"
import { BiChevronDown } from "react-icons/bi"
import { BsPen, BsArrowLeft } from "react-icons/bs"
import Popular from './Popular'
import { CgArrowsExchangeAltV } from "react-icons/cg"

import SwiperCore, { EffectCoverflow } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import 'swiper/components/effect-coverflow/effect-coverflow.min.css';
SwiperCore.use([EffectCoverflow]);
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"
import { FaStar } from "react-icons/fa";
import { FaRegStar } from "react-icons/fa";
import { useParams } from "react-router-dom";

const appSetting = {
  databaseURL: "https://story-ef71b-default-rtdb.firebaseio.com/"
}

const app = initializeApp(appSetting)
const database = getDatabase(app)
// const List = ref(database, 'List')

const cat = ref(database, 'Category')

export const Category = () => {
    let {id}=useParams();

    const [starClick,setStarClick]=useState({});

  const [swiper, setSwiper] = useState(null);

  const [subject, setSubject] = useState('')
  const [describe, setDescribe] = useState('')
  const [searchText, setSearchText] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('')


  const [search, setSearch] = useState('')
  const [searchResults2, setSearchResults2] = useState([])

  const [categories, setCategories] = useState([])
  const [newCat, setNewCat] = useState([])
  const [randomCat, setRandom] = useState([])
  const [mappable, setMappable] = useState([])

  const [show, setShow] = useState(false)
  const [show3, setShow3] = useState(false)
  const [show4, setShow4] = useState(false)
  const[menu, setMenu] = useState(false)
  const[flipped, setFlipped] = useState(false)
  const [content, setContent] = useState(false)
  
  const [check, setCheck] = useState('')
  const[selectedValue, setSelectedValue] = useState('')
  
  const[stories, setStories] = useState(0)
  const [expandedSections, setExpandedSections] = useState({})
  const [reveal, setReveal] = useState({})

  const [windowWidth, setWindowWidth] = useState(window.innerWidth)

    function handleflip(){
        setFlipped(prev => !prev)
    }
    
    useEffect(()=>{
        if(id){
            onValue(ref(database, `List/${id.toUpperCase()}`), function(snapshot) {
              if (snapshot.exists()) {
                setStories(Object.entries(snapshot.val()).length)
                setMappable(Object.entries(snapshot.val()))
              }
              else{
                setStories(0)
                setMappable([])
              }
            })      
          }
    },[id])


    function sorted(mappable){
      if(mappable?.length===0){
        return <h4>NO STORY FOUND</h4>
      }
      const sortedMappable = mappable.sort((a, b) => {
        const dateA = new Date(formattedDate2(Object.values(a[1])[4]))
        const dateB = new Date(formattedDate2(Object.values(b[1])[4]))
  
        if(dateA < dateB){
          return flipped ? 1 : -1
        }
  
        if (dateA > dateB) {
          return flipped ? -1 : 1;
        }
  
        const timeA = formattedTime(Object.values(a[1])[4]);
        const timeB = formattedTime(Object.values(b[1])[4]);
  
        if (timeA < timeB) {
          return flipped ? 1 : -1;
        }
        if (timeA > timeB) {
          return flipped ? -1 : 1;
        }
       })
  
      return sortedMappable.map((items, index) => {
        const random = ((Math.random() * 4))
        return (
          <div key={random} className='single-items'>
            {paragraph(Object.values(items[1]))}
          </div>
        )
      })
    }

    useEffect(() => {
      const checkIfClickedOutside = e => {
        if (show4 && dropdownRef.current && !dropdownRef.current.contains(e.target)) {
    
          setShow4(false)
        }
      }
    
      document.addEventListener("click", checkIfClickedOutside)
    
      return () => {
        document.removeEventListener("click", checkIfClickedOutside)
      }
    }, [show4])
    
      useEffect(() => {
        onValue(cat, function(snapshot){
          if(snapshot.exists()){
            const entries = Object.entries(snapshot.val())
            setCategories(entries.map(item => item[1]))
            setNewCat(entries.map(item => item[1]))
            setRandom(entries.map(item => item[1]))
          }
        })
      }, [])
      
      useEffect(() => {
        if (randomCat.length > 0) {
          const random = Math.floor((Math.random() * categories.length))
          setCheck(randomCat[random])
        }
      }, [randomCat])
    
      function handleStar  ()  {
        setStarClick((prevState) => ({
          ...prevState,
          [search]: !prevState[search],
        }));
      };
    
    
        function getCurrentDateTime(){
          const now = new Date()
          const day = String(now.getDate()).padStart(2, '0')
          const month = String(now.getMonth() + 1).padStart(2, '0')
          const year = String(now.getFullYear())
          const hours = String(now.getHours()).padStart(2, '0')
          const minutes = String(now.getMinutes()).padStart(2, '0')
          const seconds = String(now.getSeconds()).padStart(2, '0')
      
          return `${day}-${month}-${year}-${hours}-${minutes}-${seconds}`
        }
    
      function handleValue(e){
        const name = e.target.name
        const value = e.target.value
        
        if(name === 'subject'){
          setSubject(value)
        }
        
        else if(name === 'description'){
          setDescribe(value)
        }
      }
      
      function handleSearch(e){
        const searchValue = e.target.value
        setSearchText(searchValue)
        
        const results = performSearch(searchValue)
        setSearchResults(results)
        
        
      }
      
      function handleSearch2(e){
        console.log("values enter ")
        setSearch(e.target.value)
        setMenu(false)
        setShow3(true)
        
        const results = performSearch2(e.target.value)
        setSearchResults2(results)
      }
      
      function handleCategorySelect(category){
        setSelectedCategory(category.toUpperCase())
        setSearchText('')
        setSearchResults([])
        setShow(false)
      }
    
      function handleCategorySelect2(category){
        setSelectedValue('')
        setSearch(category)
        setSearchResults2([])
        searchBar(category)
      }
    
      function performSearch(searchValue){
        const filteredCategories = categories && categories.filter(category => 
          category.toLowerCase().startsWith(searchValue.toLowerCase()))
    
        return filteredCategories
      }
    
      function performSearch2(searchValue){
        const filteredCategories = randomCat && randomCat.filter(category => 
          category.toLowerCase().startsWith(searchValue.toLowerCase()))
    
        return filteredCategories
      }
    
      function clear(){
        setSubject('')
        setDescribe('')
        setSearchText('')
        setSelectedCategory('')
      }
    
      function handleSubmit(e){
        const random = ((Math.random() * 4))
        e.preventDefault()
        toast.success('Story Published', {
          position: 'top-center'
        });
        const Data ={
          subject: subject,
          description: describe,
          category: selectedCategory,
          timeStamp: getCurrentDateTime(),
          id: random 
        }
    
        if(subject && describe && selectedCategory){
          push(ref(database, `List/${selectedCategory}`), Data)
    
          if(selectedCategory){
            if(newCat && !newCat.some((item) => (item.toLowerCase() === selectedCategory.toLowerCase()))){
              push(cat , selectedCategory)
            }
            clear()
          }
        }
    
        // setContent(false)
        
      }
    
      function handleShow(){
        setShow(prev => !prev)
      }
    
      function handleAdd(){
        setSelectedCategory(searchText.toUpperCase())
        setSearchText('')
        setSearchResults([])
        setShow(false)
    
        if(searchText){
          if(initialCategories && !initialCategories.some((item) => (item.toLowerCase() === searchText.toLowerCase()))){
            setCategories((prevCategories) => [...prevCategories, searchText])
            initialCategories.push(searchText)
          }
        }
      }
    
      function searchBar(cat){
        cat && setMenu(true)
        setShow3(false)
        setShow4(false)
      }
    
    
    
      function handleClick(){
        // setShow3(prev => !prev)
       
        setShow4((prev)=>!prev)
      }
    
      function handleClick2(){
        setShow4(prev => !prev)
        setShow3(false)
      }
      
      useEffect(() => {
        const handleResize = () => {
          setWindowWidth(window.innerWidth)
        }
    
        window.addEventListener('resize', handleResize)
    
        return () => {
          window.removeEventListener('resize', handleResize)
        }
      }, [])
    
      useEffect(() => {
        windowWidth >425 ? setContent(true) : setContent(false)
      }, [windowWidth])
    
      function handleflip(){
        setFlipped(prev => !prev)
      }
    
      
      function handleChildValue(value){
        setSelectedValue(value)
        setSearch('')
      }
    
      
      
      function formattedDate(dateTimeString){
        const dateTimeParts = dateTimeString.split('-')
        
        const day = dateTimeParts[0]
        const month = dateTimeParts[1]
        const year = dateTimeParts[2]
        
        return `${day}-${month}-${year}`
        
      }
      
      function formattedDate2(dateTimeString){
        const dateTimeParts = dateTimeString.split('-')
        
        const day = dateTimeParts[0]
        const month = dateTimeParts[1]
        const year = dateTimeParts[2]
        
        return `${month}-${day}-${year}`
        
      }
      
      function formattedTime(dateTimeString){
        const dateTimeParts = dateTimeString.split('-')
        
        const hours = dateTimeParts[3]
        const minutes = dateTimeParts[4]
        const seconds = dateTimeParts[5]
        
        return `${hours}-${minutes}-${seconds}`
        
      }
    
      useEffect(() => {
        if(windowWidth>425){
          setReveal({})
        }
    
        else if(windowWidth<=425){
            setShow4(false)
            setShow(false)
        }
      }, [windowWidth])
    
      function togglePara(itemId) {
       windowWidth > 425 ?  
       (setExpandedSections((prevExpandedSections) => ({
         ...prevExpandedSections,
         [itemId]: !prevExpandedSections[itemId],
       }))) : 
    
       (setReveal((prevReveal) => ({
        ...prevReveal,
        [itemId]: !prevReveal[itemId],
      })))
      }
    
      const revealMain = {
        position: 'absolute',
        top: '0px',
        left: windowWidth > 375 ? '-75px' : windowWidth > 320 ?  '-90px' : '-80px',
        width:  windowWidth > 320 ? '283px' : '250px',
        height: '257px',
        boxShadow: '1px 1px 0px #000000',
      }
      
      const revealhead = {
        alignSelf: 'center',
        width: '194px',
        marginBottom: '8px',
      }
    
      const revealPara = {
        marginTop: 'initial',
        width: '215px',
        overflowY: reveal ? 'auto' : 'hidden',
        maxHeight: '112px',
        fontSize: '0.625rem'
      }
    
      function goback(){
        setReveal({})
      }
    
    
      useEffect(() => {
        if(selectedValue){
          onValue(ref(database, `List/${selectedValue.toUpperCase()}`), function(snapshot) {
            if (snapshot.exists()) {
              setStories(Object.entries(snapshot.val()).length)
              setMappable(Object.entries(snapshot.val()))
            }
          })
        }
        setReveal({})
        
      }, [selectedValue])
      
      useEffect(() => {
         if(check){
          onValue(ref(database, `List/${check.toUpperCase()}`), function(snapshot) {
            if (snapshot.exists()) {
              setStories(Object.entries(snapshot.val()).length)
              setMappable(Object.entries(snapshot.val()))
            }
          })
        }
    
        setReveal({})
    
      }, [check])
    
      
      useEffect(() => {
        if(search){
          onValue(ref(database, `List/${search.toUpperCase()}`), function(snapshot) {
            if (snapshot.exists()) {
              setStories(Object.entries(snapshot.val()).length)
              setMappable(Object.entries(snapshot.val()))
            }
            else{
              setStories(0)
              setMappable([])
            }
          })      
        }
        setReveal({})
      }, [search])
    
    
      function showContent(){
        setContent(prev => !prev)
      }
    
    
      function paragraph(item){
    
        if(item){
          const words = item[1].split(' ')
          const isExpanded = expandedSections[item[2]]
          const isRevealed = reveal[item[2]]
      
          if (words.length > 24 && !isExpanded) {
            return (
              <div className='item-section' key={item[2]} style={isRevealed ? revealMain : {}}>
                <div className='item-category'>
                  <h3>{item[0]}</h3>
                  <p>{formattedDate(item[4])}</p>
                </div>
                {isRevealed && <BsArrowLeft className='left-arrow' onClick={goback}/>}
                <h2 style={isRevealed ? revealhead : {}}>{item[3]}</h2>
                <div className='show-para'>
                  {isRevealed ? <p style={isRevealed ? revealPara : {}}>{item[1].slice(0, item[1].length)}...</p> : 
                  <p>{item[1].slice(0, 154)}...</p>}
                </div>
                  {windowWidth > 425 ? <span className='read-more' onClick={() => togglePara([item[2]])}>
                    Read more...
                  </span> :
    
                  !isRevealed && <span className='read-more' onClick={() => togglePara([item[2]])}>
                  Read more...
                </span>}
              </div>
            )
          }
      
          else{
            return (
              <div className='item-section' key={item[2]} style={isRevealed ? revealMain : {}}>
                <div className='item-category'>
                  <h3>{item[0]}</h3>
                  <p>{formattedDate(item[4])}</p>
                </div>
                {isRevealed && <BsArrowLeft className='left-arrow' onClick={goback}/>}
                <h2 style={isRevealed ? revealhead : {}}>{item[3]}</h2>
                <div className='show-para'>
                  <p style={isRevealed ? revealPara : {}}>{item[1]}</p>
                </div>
                  {words.length > 24 && windowWidth > 425 ? (
                    <span className='read-more' onClick={() => togglePara(item[2])}>
                      Read less
                    </span>
                  ) :
    
                 (words.length > 24 && !isRevealed) && <span className='read-more' onClick={() => togglePara(item[2])}>
                  Read more...
                </span>}
              </div>
            )
          }
        }
      }
    
      function sorted(mappable){
        if(mappable?.length===0){
          return <h4>NO STORY FOUND</h4>
        }
        const sortedMappable = mappable.sort((a, b) => {
          const dateA = new Date(formattedDate2(Object.values(a[1])[4]))
          const dateB = new Date(formattedDate2(Object.values(b[1])[4]))
    
          if(dateA < dateB){
            return flipped ? 1 : -1
          }
    
          if (dateA > dateB) {
            return flipped ? -1 : 1;
          }
    
          const timeA = formattedTime(Object.values(a[1])[4]);
          const timeB = formattedTime(Object.values(b[1])[4]);
    
          if (timeA < timeB) {
            return flipped ? 1 : -1;
          }
          if (timeA > timeB) {
            return flipped ? -1 : 1;
          }
         })
    
        return sortedMappable.map((items, index) => {
          const random = ((Math.random() * 4))
          return (
            <div key={random} className='single-items'>
              {paragraph(Object.values(items[1]))}
            </div>
          )
        })
      }
    


  return (
    <div>
      <section className="section-2">
        <div className="section-2-head">
          <h1>Read stories on {id}</h1>

          <div className="looking">
            <div className="choose">
              <label htmlFor="choose">
                <h3>What are you looking for?</h3>
              </label>
              <div className="filter">
                <h1 className="total-story">
                  <span>
                    {stories === 1
                      ? `${stories} story`
                      : stories === 0
                      ? `0 story`
                      : `${stories} stories`}
                  </span>{" "}
                  for you to read
                </h1>
                <div className="flex-filter">
                  <h2 className="filter-heading">
                    Sort:
                    <span onClick={handleflip}>
                      {flipped ? `Newest to Oldest` : `Oldest to Newest`}
                    </span>
                  </h2>
                  <CgArrowsExchangeAltV
                    className="filterarrow"
                    onClick={handleflip}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {windowWidth > 425 ? (
          <div>
            {(
              <div className="container">
                <section className="item-section-main">
                  <div className="item-section-container">
                    {mappable && sorted(mappable)}
                  </div>
                </section>
              </div>
            )}
          </div>
        ) : (
          <div className="container">
            <section className="item-section-main">
              {/* <Swiper
                effect="coverflow"
                // grabCursor='true'
                centeredSlides="true"
                slidesPerView={3}
                coverflowEffect={{
                  rotate: 0,
                  stretch: 0,
                  depth: 200,
                  modifier: 1,
                  slideShadows: false,
                }}
                // onSwiper={handleSwiperInit}
                // onSlideChange={handleSlideChange}
              >
                <div className="swiper-wrapper">
                  {(() => {
                    const sortedMappable = mappable.sort((a, b) => {
                      const dateA = new Date(
                        formattedDate2(Object.values(a[1])[4])
                      );
                      const dateB = new Date(
                        formattedDate2(Object.values(b[1])[4])
                      );

                      if (dateA < dateB) {
                        return flipped ? 1 : -1;
                      }

                      if (dateA > dateB) {
                        return flipped ? -1 : 1;
                      }

                      const timeA = formattedTime(Object.values(a[1])[4]);
                      const timeB = formattedTime(Object.values(b[1])[4]);

                      if (timeA < timeB) {
                        return flipped ? 1 : -1;
                      }
                      if (timeA > timeB) {
                        return flipped ? -1 : 1;
                      }
                    });

                    return sortedMappable.map((items, index) => {
                      const random = Math.random() * 4;
                      return (
                        <SwiperSlide key={random} className="swiper-slide">
                          {paragraph(Object.values(items[1]))}
                        </SwiperSlide>
                      );
                    });
                  })()}
                </div>
              </Swiper> */}
            </section>
          </div>
        )}
      </section>
    </div>
  );
};