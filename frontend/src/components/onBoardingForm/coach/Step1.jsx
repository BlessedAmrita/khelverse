import { Input } from '@/components/ui/input';

export default function Step1({ formData, setFormData }) {
  return (
    <div>
      <h2 className='text-2xl font-sprintura text-lavender-200 font-bold mb-4'>Coach Basic Info</h2>

      <div className='my-3'>
      <label>First Name</label>
      <Input
        placeholder='Enter your first name'
        value={formData.firstName}
        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
        className="border border-white/20 bg-transparent text-white mt-1"
      />
      </div>

      <div className='my-3'>
      <label>Last Name</label>
      <Input
        placeholder='Enter your last name'
        value={formData.lastName}
        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
        className="border border-white/20 bg-transparent text-white mt-1"
      />
      </div>

      
      <div className='my-3'>
      <label>Date of Birth</label>
      <Input
        type='date'
        value={formData.dob}
        onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
        className="border border-white/20 bg-transparent text-white mt-1"
      />
      </div>

    
      <label>Gender</label>
      <select
        value={formData.gender}
        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
        className='border p-2 w-full  border-white/20 bg-transparent text-white mt-1'
      >
        <option value=''>Select Gender</option>
        <option value='Male'>Male</option>
        <option value='Female'>Female</option>
        <option value='Other'>Other</option>
      </select>
    </div>
  );
}
