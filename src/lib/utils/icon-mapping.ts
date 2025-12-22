import {
  CalendarIcon,
  CheckCircleIcon,
  CrownIcon,
  DollarSignIcon,
  FlameIcon,
  GiftIcon,
  HeartIcon,
  MedalIcon,
  PackageIcon,
  ShieldIcon,
  SparklesIcon,
  StarIcon,
  TrophyIcon,
  UsersIcon,
  ZapIcon,
  type LucideIcon,
} from "lucide-react"

export const materialToLucideIconMap: Record<string, LucideIcon> = {
  emoji_events: TrophyIcon,
  military_tech: MedalIcon,
  trophy: TrophyIcon,
  medal: MedalIcon,
  star: StarIcon,
  crown: CrownIcon,
  style: SparklesIcon,
  auto_awesome: SparklesIcon,
  stars: SparklesIcon,
  attach_money: DollarSignIcon,
  payments: DollarSignIcon,
  monetization_on: DollarSignIcon,
  people: UsersIcon,
  group: UsersIcon,
  person: UsersIcon,
  calendar_today: CalendarIcon,
  event: CalendarIcon,
  schedule: CalendarIcon,
  inventory_2: PackageIcon,
  package: PackageIcon,
  category: PackageIcon,
  bolt: ZapIcon,
  flash_on: ZapIcon,
  electric_bolt: ZapIcon,
  local_fire_department: FlameIcon,
  whatshot: FlameIcon,
  shield: ShieldIcon,
  security: ShieldIcon,
  redeem: GiftIcon,
  card_giftcard: GiftIcon,
  gift: GiftIcon,
  check_circle: CheckCircleIcon,
  verified: CheckCircleIcon,
  favorite: HeartIcon,
  heart: HeartIcon,
}

export function getMaterialIcon(
  materialIconName: string | null | undefined,
): LucideIcon {
  if (!materialIconName) {
    return SparklesIcon
  }

  return materialToLucideIconMap[materialIconName] || SparklesIcon
}
