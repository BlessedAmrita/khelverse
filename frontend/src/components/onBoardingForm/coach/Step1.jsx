'use client';

import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function Step1({ formData, setFormData, errors }) {
  const indianStates = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
    "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
    "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
    "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
    "Uttar Pradesh", "Uttarakhand", "West Bengal",
    "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu",
    "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
  ];

  return (
    <div>
      <h2 className='text-2xl font-sprintura text-lavender-200 font-bold mb-4'>Coach Basic Info</h2>

      {/* First Name */}
      <div className='my-3'>
        <label>First Name</label>
        <Input
          type='text'
          placeholder='Enter your first name'
          value={formData.firstName}
          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
          className="border border-white/20 bg-transparent text-white mt-1"
        />
        {errors?.firstName && <p className='text-sm text-purple-dark mt-1'>{errors.firstName}</p>}
      </div>

      {/* Last Name */}
      <div className='my-3'>
        <label>Last Name</label>
        <Input
          type='text'
          placeholder='Enter your last name'
          value={formData.lastName}
          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
          className="border border-white/20 bg-transparent text-white mt-1"
        />
        {errors?.lastName && <p className='text-sm text-purple-dark mt-1'>{errors.lastName}</p>}
      </div>

      {/* DOB */}
      <div className='my-3'>
        <label>Date of Birth</label>
        <Input
          type='date'
          value={formData.dob}
          onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
          className="border border-white/20 bg-transparent text-white mt-1"
        />
        {errors?.dob && <p className='text-sm text-purple-dark mt-1'>{errors.dob}</p>}
      </div>

      {/* Gender */}
      <div className='my-3'>
        <label>Gender</label>
        <Select
          value={formData.gender}
          onValueChange={(value) => setFormData({ ...formData, gender: value })}
        >
          <SelectTrigger className="w-full border border-white/20 bg-transparent text-white mt-1">
            <SelectValue placeholder="Select your gender" />
          </SelectTrigger>
          <SelectContent className="bg-white text-black">
            <SelectItem value="Male">Male</SelectItem>
            <SelectItem value="Female">Female</SelectItem>
            <SelectItem value="Other">Other</SelectItem>
          </SelectContent>
        </Select>
        {errors?.gender && <p className='text-sm text-purple-dark mt-1'>{errors.gender}</p>}
      </div>

      {/* City (moved here after gender) */}
      <div className='my-3'>
        <label>City</label>
        <Input
          type='text'
          placeholder='Enter your city'
          value={formData.city}
          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
          className="border border-white/20 bg-transparent text-white mt-1"
        />
        {errors?.city && <p className='text-sm text-purple-dark mt-1'>{errors.city}</p>}
      </div>

      {/* State */}
      <div className='my-3'>
        <label>State</label>
        <Select
          value={formData.state}
          onValueChange={(value) => setFormData({ ...formData, state: value })}
        >
          <SelectTrigger className="w-full border border-white/20 bg-transparent text-white mt-1">
            <SelectValue placeholder="Select your state" />
          </SelectTrigger>
          <SelectContent className="bg-white text-black max-h-60 overflow-y-auto">
            {indianStates.map((state, index) => (
              <SelectItem key={index} value={state}>
                {state}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors?.state && <p className='text-sm text-purple-dark mt-1'>{errors.state}</p>}
      </div>
    </div>
  );
}
