import { useEffect, useState } from 'react';
import "./style.css"
import Image from 'next/image';
import axios from 'axios';
import { baseurl } from '../utils/Url';
import { toast } from 'react-toastify';
import AddressEdit from './AEPU';

export default function AccountsSection() {
   const [activeTab, setActiveTab] = useState('orders');
   const tabs = [
      { id: 'update-profile', label: 'Profile Info', icon: 'fi fi-rs-user' },
      { id: 'shipping-address', label: 'Shipping Address', icon: 'fi fi-rs-location-alt' },
      { id: 'orders', label: 'Orders', icon: 'fi fi-rs-shopping-bag' },
      { id: 'change-password', label: 'Change Password', icon: 'fi fi-rs-settings-sliders' },
      { id: 'logout', label: 'Logout', icon: 'fi fi-rs-exit' },
   ]
   const handleTabClick = (tabId) => {
      setActiveTab(tabId);
   };

   const [user, setUser] = useState({ username: '', email: '', phone: '', gender: null, first_name: '', last_name: '', type: 'profileinfo' });
   const updateUser = (key, value) => { setUser({ ...user, [key]: value }); }
   const [profilePic, setProfilePic] = useState(`https://robohash.org/${user.username}.jpg?size=200x200&set=set1&bgset=bg2`);
   const [editablePI, setEditablePI] = useState(true);
   const [editableSA, setEditableSA] = useState("");

   const GetAddress = () => {
      axios.get(`${baseurl}/profile/`, { headers: { Authorization: `Token ${localStorage.getItem('token')}` } })
         .then((res) => {
            console.log(res.data);
            setUser(res.data['ProfileInfo']);
            setAddresses(res.data['ShippingAddresses']);
            setProfilePic(`${baseurl}${res.data['ProfileInfo'].pic}`);
            setEditablePI(false);
         }).catch((err) => {
            console.log(err);
         })
   }
   useEffect(() => {
      GetAddress();
   }, []);
   const handleProfileUpdate = (e) => {
      e.preventDefault();
      user['type'] = 'profileinfo';
      axios.put(`${baseurl}/profile/`, user, { headers: { Authorization: `Token ${localStorage.getItem('token')}` } })
         .then((res) => {
            if (res.data['message'] === "Profile Updated Successfully") {
               toast.success('Profile Updated Successfully!');
               editablePI && setEditablePI(false);
            }
            else {
               for (let key in res.data) {
                  console.log(res.data[key]);
                  toast.error(res.data[key][0]);
                  !editablePI && setEditablePI(true);
               }
            }
         }).catch((err) => {
            console.log(err);
         })
   };

   const ProfileInfoEdit = (e) => {
      e.preventDefault();
      (!editablePI) && setEditablePI(true);
      if (editablePI) {
         handleProfileUpdate(e);
      }
   }


   const [addresses, setAddresses] = useState([]);
   const deleteAddress = (id) => {
      axios.delete(`${baseurl}/profile/`, { headers: { Authorization: `Token ${localStorage.getItem('token')}` }, data: { type: 'addressDelete', id: id } })
         .then((res) => {
            if (res.data['message'] === "Address Deleted Successfully") {
               toast.success('Address Deleted Successfully!');
               setAddresses(addresses.filter((address) => address.id !== id));
            }
            else {
               toast.error('Error Occured');
            }
         }).catch((err) => {
            console.log(err);
         })
   }


   return (
      <section className="accounts section--lg">
         <div className="grid accounts__container container">
            <div>
               <div className="flex flex-wrap gap-5 justify-evenly m-0 p-8 account__tabs align-middle">
                  <Image src={profilePic} className='rounded' width={100} height={100} alt='ProfilePic' priority={false} loading='lazy' />
                  <div className='topc'>
                     <h3 className='mb-2'>{user.first_name} {user.last_name}</h3>
                     <p >{user.email}</p>
                     <p >{user.phone}</p>
                  </div>
               </div>
               <div className="mt-5 account__tabs">
                  {tabs.map((tab, index) => (
                     <p
                        className={`account__tab ${activeTab === tab.id ? 'active-tab' : ''}`}
                        data-target={tab.id}
                        onClick={() => handleTabClick(tab.id)}
                        key={index}
                     >
                        <i className={tab.icon}></i>
                        <b>{tab.label}</b>
                     </p>
                  ))}
               </div>
            </div>

            <div className="tabs__content">
               <div className={`tab__content ${activeTab === 'update-profile' ? 'active-tab' : ''}`} id="update-profile">
                  <h3 className="tab__header">Personal Information <i onClick={(e) => ProfileInfoEdit(e)}>{editablePI ? "Save" : "Edit"}</i></h3>
                  <div className="tab__body">
                     <form className="grid form" onSubmit={handleProfileUpdate}>
                        <div className="form__field">
                           <label htmlFor="username" className="form__label">Username</label>
                           <input
                              type="text"
                              id="username"
                              value={user.username}
                              onChange={(e) => updateUser('username', e.target.value)}
                              placeholder="Username"
                              disabled={!editablePI}
                              name="username"
                              className="form__input"
                              suppressHydrationWarning
                           />
                        </div>
                        <div className="form__field">
                           <label htmlFor="first_name" className="form__label">First Name</label>
                           <input
                              type="text"
                              id="first_name"
                              value={user.first_name}
                              onChange={(e) => updateUser('first_name', e.target.value)}
                              placeholder="First Name"
                              className="form__input"
                              disabled={!editablePI}
                              suppressHydrationWarning
                           />
                        </div>
                        <div className="form__field">
                           <label htmlFor="last_name" className="form__label">Last Name</label>
                           <input
                              type="text"
                              id="last_name"
                              value={user.last_name}
                              onChange={(e) => updateUser('last_name', e.target.value)}
                              placeholder="Last Name"
                              className="form__input"
                              disabled={!editablePI}
                              suppressHydrationWarning
                           />
                        </div>
                        <div className="form__field">
                           <label htmlFor="gender" className="form__label">Gender</label>
                           <div className="selection">
                              <label htmlFor="male">
                                 <input
                                    type="radio"
                                    name="gender"
                                    id="male"
                                    required
                                    disabled={!editablePI}
                                    checked={user.gender === "Male"}
                                    onChange={() => updateUser('gender', "Male")}
                                 />
                                 <p className={editablePI ? "inline-block" : "inline-block opacity-70"}>Male</p>
                              </label>
                              <label htmlFor="female">
                                 <input
                                    type="radio"
                                    name="gender"
                                    id="female"
                                    required
                                    disabled={!editablePI}
                                    checked={user.gender === "Female"}
                                    onChange={() => updateUser('gender', "Female")}
                                 />
                                 <p className={editablePI ? "inline-block" : "inline-block opacity-70"}>Female</p>
                              </label>
                           </div>
                        </div>
                        <div className="form__field">
                           <label htmlFor="phone" className="form__label">Phone</label>
                           <input
                              type="phone"
                              id="state"
                              value={user.phone}
                              onChange={(e) => updateUser('phone', e.target.value)}
                              placeholder="+91 1234567890"
                              className="form__input"
                              disabled={!editablePI}
                              suppressHydrationWarning
                           />
                        </div>
                        <div className="form__field">
                           <label htmlFor="country" className="form__label">E-Mail</label>
                           <input
                              type="email"
                              id="country"
                              value={user.email}
                              onChange={(e) => updateUser('email', e.target.value)}
                              placeholder="Country"
                              className="form__input"
                              disabled={!editablePI}
                              suppressHydrationWarning
                           />
                        </div>
                        <div className="form__btn">
                           <button className="btn btn--md" type='submit' suppressHydrationWarning disabled={!editablePI} onClick={handleProfileUpdate} >Save Changes</button>
                        </div>
                     </form>
                  </div>
               </div>

               {/* shipping-address Tab */}
               <div className={`tab__content ${activeTab === 'shipping-address' ? 'active-tab' : ''}`} id="shipping-address">
                  {addresses.length > 0 ? (
                     <div>
                        {addresses.map((address) => (
                           <div key={address.id}>
                              {editableSA === address.id ?
                                 (
                                    <AddressEdit address={address} setEditableSA={setEditableSA} GetAddress={GetAddress}/>
                                 ) :
                                 (
                                    <div className="border border-gray-200  bg-white">
                                       <div className="flex justify-between items-center mb-4 bg-slate-100 p-4 ">
                                          <h3 className="font-semibold text-xl text-gray-900">{address.name}</h3>
                                          <div className="flex space-x-3">
                                             <button className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500" onClick={() => setEditableSA(address.id)}>
                                                Edit
                                             </button>
                                             <button className="px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500" onClick={() => deleteAddress(address.id)}>
                                                Delete
                                             </button>
                                          </div>
                                       </div>
                                       <div className="space-y-2 text-gray-700 p-6 pt-0 ml-3">
                                          <p>{address.address}, {address.locality}, {address.city}-{address.pincode}, {address.state}</p>
                                          <p><span className='font-bold'>Landmark: </span>{address.landmark}</p>
                                          <p><span className='font-bold'>Phone: </span>{address.phone}{address.alternate_phone && (<i>, {address.alternate_phone}</i>)} </p>
                                       </div>
                                    </div>
                                 )
                              }
                           </div>
                        ))}
                     </div>
                  ) : (
                     <div className="text-gray-500 italic text-center py-6">No address yet</div>
                  )}
                  <div className="mt-4 w-full">
                     {editableSA === "new" ?
                        (
                           <AddressEdit address={{}} setEditableSA={setEditableSA} GetAddress={GetAddress}/>
                        ) : (
                           <button className="btn btn--md " onClick={() => setEditableSA("new")}>Add New Address</button>
                        )
                     }
                  </div>
               </div>


               {/* Orders Tab */}
               <div className={`tab__content ${activeTab === 'orders' ? 'active-tab' : ''}`} id="orders" >
                  <h3 className="tab__header">Your Orders</h3>
                  <div className="tab__body">
                     <table className="placed__order-table">
                        <thead>
                           <tr>
                              <th>Orders</th>
                              <th>Date</th>
                              <th>Status</th>
                              <th>Totals</th>
                              <th>Actions</th>
                           </tr>
                        </thead>
                        <tbody>
                           <tr>
                              <td>#1357</td>
                              <td>March 19, 2022</td>
                              <td>Processing</td>
                              <td>$125.00</td>
                              <td><a href="#" className="view__order">View</a></td>
                           </tr>
                           <tr>
                              <td>#2468</td>
                              <td>June 29, 2022</td>
                              <td>Completed</td>
                              <td>$364.00</td>
                              <td><a href="#" className="view__order">View</a></td>
                           </tr>
                           <tr>
                              <td>#2366</td>
                              <td>August 02, 2022</td>
                              <td>Completed</td>
                              <td>$280.00</td>
                              <td><a href="#" className="view__order">View</a></td>
                           </tr>
                        </tbody>
                     </table>
                  </div>
               </div>

               {/* Change Password Tab */}
               <div className={`tab__content ${activeTab === 'change-password' ? 'active-tab' : ''}`} id="change-password">
                  <h3 className="tab__header">Change Password</h3>
                  <div className="tab__body">
                     <form className="grid form">
                        <input
                           type="password"
                           placeholder="Current Password"
                           className="form__input"
                        />
                        <input
                           type="password"
                           placeholder="New Password"
                           className="form__input"
                        />
                        <input
                           type="password"
                           placeholder="Confirm Password"
                           className="form__input"
                        />
                        <div className="form__btn">
                           <button className="btn btn--md">Save</button>
                        </div>
                     </form>
                  </div>
               </div>

               <div className={`tab__content ${activeTab === 'logout' ? 'active-tab' : ''}`} id="change-password">
                  <h3 className="tab__header">Logout</h3>
                  <div className="tab__body">
                     <button className="flex justify-evenly btn btn--md" onClick={() => {
                        localStorage.clear();
                        window.location.href = "/";
                     }}>
                        {/* <b>Save</b> */}
                        <svg xmlns="http://www.w3.org/2000/svg" id="Layer_1" data-name="Layer 1" viewBox="0 0 24 24" className="inline w-6 svg">
                           <path d="M22.488,11.63c-.063-.156-1.607-3.858-7.361-6.62-.499-.242-1.095-.029-1.334,.469s-.029,1.095,.469,1.334c2.947,1.415,4.617,3.056,5.502,4.19H6.745c-.553,0-1,.448-1,1s.447,1,1,1h13.005c-.895,1.139-2.574,2.79-5.488,4.19-.498,.239-.708,.836-.469,1.334,.172,.358,.529,.567,.902,.567,.145,0,.292-.032,.432-.099,5.577-2.677,7.189-6.208,7.354-6.603,.103-.243,.105-.519,.007-.763Z" />
                           <path d="M8.373,21.008c-1.75-.229-3.18-.533-3.922-.705-.312-1.231-1.012-4.433-1.012-8.301s.701-7.074,1.013-8.303c.736-.173,2.159-.479,3.92-.708,.548-.071,.934-.573,.862-1.121-.071-.548-.57-.938-1.12-.863-2.738,.356-4.657,.875-4.738,.897-.331,.091-.594,.346-.693,.675-.051,.167-1.243,4.164-1.243,9.422s1.192,9.254,1.243,9.422c.101,.331,.364,.586,.698,.676,.082,.022,2.018,.536,4.732,.892,.044,.005,.088,.008,.131,.008,.495,0,.925-.367,.99-.87,.072-.547-.313-1.05-.861-1.122Z" />
                        </svg>
                     </button>
                  </div>
               </div>

            </div>

         </div>
      </section>
   );
}