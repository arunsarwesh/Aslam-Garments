import axios from "axios";
import { useState } from "react";
import { baseurl } from "../utils/Url";
import { toast } from "react-toastify";

export default function AddressEdit({ address, setEditableSA, GetAddress }) {
  const [formData, setFormData] = useState({
    id: address.id || "",
    name: address.name || "",
    address: address.address || "",
    landmark: address.landmark || "",
    locality: address.locality || "",
    city: address.city || "",
    state: address.state || "",
    pincode: address.pincode || "",
    phone: address.phone || "",
    alternate_phone: address.alternate_phone || "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { ...formData, type: "addressUpdate" }; 
    const config = { headers: { Authorization: `Token ${localStorage.getItem("token")}` } };

    formData['type'] = "addressUpdate";
    if (!formData.id) {
      axios.post(`${baseurl}/profile/`, payload, config)
        .then((res) => {
          console.log(res.data);
          toast.success("Address created successfully!")
          GetAddress()
          setEditableSA("")
        })
        .catch((err) => {
          console.log(err.response.data)
          for (let key in err.response.data) {
            toast.error(`${key.toString().toUpperCase()}: ${err.response.data[key]}`);
          }
        });
    } else {
      axios.put(`${baseurl}/profile/`, payload, config)
        .then((res) => {
          console.log(res.data);
          toast.success("Updated")
          GetAddress()
          setEditableSA("")
        })
        .catch((err) => {
          console.log(err.response.data)
          for (let key in err.response.data) {
            toast.error(`${key.toString().toUpperCase()}: ${err.response.data[key]}`);
          }
        });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-container-color p-6 space-y-6"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-text-color" htmlFor="name">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="form__input w-[80%]"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-color" htmlFor="phone">
            Phone
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className="form__input w-[80%]"
            required
          />
        </div>
        <div>
          <label
            className="block text-sm font-medium text-text-color"
            htmlFor="alternate_phone"
          >
            Alternate Phone
          </label>
          <input
            type="tel"
            id="alternate_phone"
            name="alternate_phone"
            value={formData.alternate_phone}
            onChange={handleInputChange}
            className="form__input w-[80%]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-color" htmlFor="pincode">
            Pincode
          </label>
          <input
            type="text"
            id="pincode"
            name="pincode"
            value={formData.pincode}
            onChange={handleInputChange}
            className="form__input w-[80%]"
            required
          />
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-medium text-text-color" htmlFor="address">
            Address
          </label>
          <textarea
            id="address"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            className="form__input w-[90%] textarea"
            rows="2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-color" htmlFor="landmark">
            Landmark
          </label>
          <input
            type="text"
            id="landmark"
            name="landmark"
            value={formData.landmark}
            onChange={handleInputChange}
            className="form__input w-[80%]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-color" htmlFor="locality">
            Locality
          </label>
          <input
            type="text"
            id="locality"
            name="locality"
            value={formData.locality}
            onChange={handleInputChange}
            className="form__input w-[80%]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-color" htmlFor="city">
            City
          </label>
          <input
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            className="form__input w-[80%]"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-color" htmlFor="state">
            State
          </label>
          <input
            type="text"
            id="state"
            name="state"
            value={formData.state}
            onChange={handleInputChange}
            className="form__input w-[80%]"
            required
          />
        </div>
      </div>
      <div className="flex justify-end space-x-4">
        <button type="submit" className="btn btn--sm bg-first-color text-white hover:bg-first-color-alt focus:ring-2" >
          Save
        </button>
        <button type="button" className="btn btn--sm bg-text-color-light text-white hover:bg-text-color focus:ring-2" onClick={() => setEditableSA("")} >
          Cancel
        </button>
      </div>
    </form>
  );
}