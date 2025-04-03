import { Input } from '@/components/ui/input';

export default function Step2({ formData, setFormData }) {
  return (
    <div>
      <h2 className='text-2xl font-sprintura text-lavender-200 font-bold mb-4'>Coaching Experience</h2>

      <div className='my-3'>
      <label>Years of Experience</label>
      <Input
        type='number'
        placeholder='Enter your experience in years'
        value={formData.experience}
        onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
        className="border border-white/20 bg-transparent text-white mt-1"
      />
      </div>

      <div className='my-3'>
      <label>Certifications</label>
      <Input
        placeholder='Enter your certifications'
        value={formData.certifications}
        onChange={(e) => setFormData({ ...formData, certifications: e.target.value })}
        className="border border-white/20 bg-transparent text-white mt-1"
      />
      </div>

      <div className='my-3'>
      <label>Expertise</label>
      <Input
        placeholder='Enter your expertise (e.g., Strength Training)'
        value={formData.expertise}
        onChange={(e) => setFormData({ ...formData, expertise: e.target.value })}
        className="border border-white/20 bg-transparent text-white mt-1"
      />
      </div>
    </div>
  );
}
