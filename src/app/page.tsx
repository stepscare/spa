'use client'
import axios from 'axios';
import { setHours, setMinutes } from 'date-fns';
import { useEffect, useState } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaPhoneAlt } from "react-icons/fa";
import styles from "./styles.module.css";

interface Category {
  _id: string;
  title: string;
}

interface Item {
  _id: string;
  title: string;
  price: number;
  header?: string;
  categoryId: string;
}

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [activeButton, setActiveButton] = useState<string | null>("Categories");
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [startDate, setStartDate] = useState(new Date());
  const [completedDates, setCompletedDates] = useState<any>([]);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [mobile, setMobile] = useState('');

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    const formData = {
      firstName,
      lastName,
      mobile,
      date: startDate,
      ServiceId: selectedItem?._id,
    };

    try {
      const response = await axios.post('/api/reservations', formData);
      alert("Reservation Completed")
    } catch (error) {
      console.error('Error making reservation:', error);
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await axios.get<Category[]>('/api/categories');
      setCategories(response.data);
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      const fetchItems = async () => {
        const response = await axios.get<Item[]>(`/api/items/category?categoryId=${selectedCategory}`);
        console.log(response.data)
        setItems(response.data);
      };
      fetchItems();
    }
  }, [selectedCategory]);

  useEffect(() => {
    const fetchCompletedDates = async () => {
      try {
        const response = await axios.get<Date[]>('/api/completed');
        
        // Assuming the response contains Date strings or objects, convert them to hours and minutes
        const dates = response.data.map(dateString => {
          const date = new Date(dateString);
          return { hour: date.getHours(), minute: date.getMinutes() };
        });
  
        setCompletedDates(dates);
      } catch (error) {
        console.error('Error fetching completed dates:', error);
      }
    };
    fetchCompletedDates();
  }, []);

  const filterTime = (time: Date) => {
    const selectedHour = time.getHours();
    const selectedMinute = time.getMinutes();

    return !completedDates.some((completedTime: { hour: number, minute: number }) => {
      return completedTime.hour === selectedHour && completedTime.minute === selectedMinute;
    });
  };

  const handleButtonClick = (buttonName: string) => {
    setActiveButton(buttonName);
  };

  const handleItemSelect = (item: Item) => {
    setSelectedItem(item);
  };

  const isNotMonday = (date: Date) => {
    const day = date.getDay();
    return day !== 1; // 1 represents Monday
  };

  const renderContent = () => {
    switch (activeButton) {
      case 'Service':
        return selectedCategory ? (
          <>
            <div className={styles.header}>Our Services</div>
            <ul>
              {items.map((item) => (
                <li key={item._id} className={styles.row}>
                  <div>
                    {item.title}  <span className={styles.price}>SAR{item.price}</span>
                  </div>
                  <button onClick={() =>
                    { 
                      handleItemSelect(item)
                      handleButtonClick('Date')
                    }}>Select</button>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <div className={styles.header}>Choose Category</div>
        );
      case 'Date':
        return (
          <div>
            <div className={styles.header}>Select Date</div>
            <div className={styles.form}>
            <DatePicker 
              selected={startDate} 
              onChange={(date: any) => setStartDate(date)} 
              dateFormat="MMMM d, yyyy h:mm aa"  
              inline 
              minDate={new Date()} 
              filterDate={isNotMonday} 
              showTimeSelect 
              timeIntervals={30}  
              minTime={setHours(setMinutes(new Date(), 45), 12)} 
              maxTime={setHours(setMinutes(new Date(), 30), 21)}
              filterTime={filterTime}
            />

            <div>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="firstName">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="lastName">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    placeholder="Doe"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="mobile">
                    Mobile # <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    id="mobile"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    required
                    className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    placeholder="(123) 456-7890"
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-lg shadow focus:outline-none focus:ring focus:ring-indigo-300"
                  >
                    Confirm
                  </button>
                </div>
              </form>
            </div>
            </div>
          </div>
        );
      default:
        return (
          <div>
            <div className={styles.header}>Choose Category</div>
            {categories.map((category) => (
              <div className={styles.row} key={category._id}>
                <span>{category.title}</span>
                <button 
                  onClick={() => { 
                    setSelectedCategory(category._id);
                    handleButtonClick('Service');
                  }} 
                >
                  Select
                </button>
              </div>
            ))}
          </div>
        );
    }
  };

  return (
    <div>
      <div className={styles.banner}>Steps Care Spa</div>

      <div className={styles.container}>
        <div className={styles.contact}>
          <p style={{fontSize: "1.2em" , marginBottom: "1em"}}>Steps Care Spa</p>
          <a href='https://wa.me/966556474040'> <FaPhoneAlt /> +966556474040</a>
          <a href='mailto:stepscare23@gmail.com'>stepscare23@gmail.com</a>
          <a href='https://maps.app.goo.gl/7WtvsxuXvZxafutHA'>Abu Huraira Rd, Abha 62527, Saudi Arabia</a>
        </div>

        <div>
          <div className={styles.btns_container}>
            <div 
              className={activeButton === 'Categories' ? styles.active : ''}
              onClick={() => handleButtonClick('Categories')}
            >
              Categories
            </div>
            <div 
              className={activeButton === 'Service' && selectedCategory ? styles.active : ''}
              onClick={() => {
                if(selectedCategory) {
                  handleButtonClick('Service');
                }
              }}
            >
              Service
            </div>
            <div 
              className={activeButton === 'Date' ? styles.active : ''}
              onClick={() => {
                if(selectedCategory) {
                  handleButtonClick('Date')
                }
              }}
            >
              Book
            </div>
          </div>
          <div className={styles.table}>
            {renderContent()}

          </div>
        </div>

        <div>
          <div style={{fontSize: "1.2em"}}>Business Hours</div>
          <div className={styles.workingDays}>
            <div>
              <p>Tue</p>
              <p>1:00PM : 9:30PM</p>
            </div>
            <div>
              <p>Wed</p>
              <p>1:00PM : 9:30PM</p>
            </div>
            <div>
              <p>Thu</p>
              <p>1:00PM : 9:30PM</p>
            </div>
            <div>
              <p>Fri</p>
              <p>1:00PM : 9:30PM</p>
            </div>
            <div>
              <p>Sat</p>
              <p>1:00PM : 9:30PM</p>
            </div>
            <div>
              <p>Sun</p>
              <p>1:00PM : 9:30PM</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
