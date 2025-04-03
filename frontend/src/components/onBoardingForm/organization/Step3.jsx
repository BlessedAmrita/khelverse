import { Input } from '@/components/ui/input';

export default function Step3({ formData, setFormData }) {
  return (
    <div>
      <h2 className='text-2xl font-sprintura text-lavender-200 font-bold mb-4'>Contact Details</h2>

      <div className='my-3'>
      <label>Contact Person</label>
      <Input
        placeholder="Enter contact person's name"
        value={formData.contactPerson}
        onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
        className="border border-white/20 bg-transparent text-white mt-1"
      />
      </div>

      <div className='my-3'>
      <label>Email</label>
      <Input
        type='email'
        placeholder='Enter contact email'
        value={formData.contactEmail}
        onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
        className="border border-white/20 bg-transparent text-white mt-1"
      />
      </div>
      
      <div className='my-3'>
      <label>Phone</label>
      <Input
        type='tel'
        placeholder='Enter contact phone number'
        value={formData.contactPhone}
        onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
        className="border border-white/20 bg-transparent text-white mt-1"
      />
      </div>
    </div>
  );
}
