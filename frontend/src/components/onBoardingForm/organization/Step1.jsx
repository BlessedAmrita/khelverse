import { Input } from '@/components/ui/input';

export default function Step1({ formData, setFormData }) {
  return (
    <div>
      <h2 className='text-2xl font-sprintura text-lavender-200 font-bold mb-4'>Organization Basic Info</h2>

      <div className='my-3'>
      <label>Organization Name</label>
      <Input
        placeholder='Enter organization name'
        value={formData.orgName}
        onChange={(e) => setFormData({ ...formData, orgName: e.target.value })}
        className="border border-white/20 bg-transparent text-white mt-1"
      />
      </div>

      <div className='my-3'>
      <label>Type</label>
      <Input
        placeholder='Academy, Club, Federation, etc.'
        value={formData.orgType}
        onChange={(e) => setFormData({ ...formData, orgType: e.target.value })}
        className="border border-white/20 bg-transparent text-white mt-1"
      />
      </div>

      <div className='my-3'>
      <label>Established Year</label>
      <Input
        type='number'
        placeholder='Enter year of establishment'
        value={formData.establishedYear}
        onChange={(e) => setFormData({ ...formData, establishedYear: e.target.value })}
        className="border border-white/20 bg-transparent text-white mt-1"
      />
      </div>
    </div>
  );
}
