import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';

export default function Step3({ formData, setFormData }) {
  return (
    <div>
      <h2 className='text-2xl font-sprintura text-lavender-200 font-bold mb-4'>Coaching Preferences</h2>

      <div className='my-3'>
      <label>Sport</label>
      <Input
        placeholder='Enter your sport'
        value={formData.sport}
        onChange={(e) => setFormData({ ...formData, sport: e.target.value })}
        className="border border-white/20 bg-transparent text-white mt-1"
      />
      </div>

      <div className='my-3'>
      <label>Coaching Level</label>
      <Select
        value={formData.level}
        onValueChange={(value) => setFormData({ ...formData, level: value })}
      >
        <SelectTrigger className='w-full border p-2 border-white/20 bg-transparent text-white mt-1'>
          <SelectValue placeholder='Select Level' />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='Beginner'>Beginner</SelectItem>
          <SelectItem value='Intermediate'>Intermediate</SelectItem>
          <SelectItem value='Pro'>Pro</SelectItem>
        </SelectContent>
      </Select>
      </div>

      <label>Preferred Training Mode</label>
      <Select
        value={formData.trainingMode}
        onValueChange={(value) => setFormData({ ...formData, trainingMode: value })}
      >
        <SelectTrigger className='w-full border p-2   border-white/20 bg-transparent text-white mt-1'>
          <SelectValue placeholder='Select Training Mode' />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='Online'>Online</SelectItem>
          <SelectItem value='Offline'>Offline</SelectItem>
          <SelectItem value='Hybrid'>Hybrid</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
