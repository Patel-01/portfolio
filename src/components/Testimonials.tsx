import { VoicesStage } from './cinematic'
import { resume } from '../data/resume'

export function Testimonials() {
  return <VoicesStage items={resume.testimonials} photoBase={import.meta.env.BASE_URL} />
}
