import { Input } from '@/components/ui/input';

export default function Step2({ formData, setFormData }) {
  return (
    <div>
      <h2 className='text-2xl text-lavender-200 font-bold mb-4 font-sprintura'>Sports & Experience</h2>

      <div className='my-3'>
      <label>Sport</label>
      <Input
        placeholder='Enter primary sport'
        value={formData.sport}
        onChange={(e) => setFormData({ ...formData, sport: e.target.value })}
        className="border border-white/20 bg-transparent text-white mt-1"
      />
       </div>

      <label>Experience Level</label>
      <select
        value={formData.experienceLevel}
        onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value })}
        className='border p-2 w-full bg-apts-lightdark font-black'
      >
        <option>Beginner</option>
        <option>Intermediate</option>
        <option>Professional</option>
      </select>
    </div>
  );
}
