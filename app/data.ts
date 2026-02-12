// 打地鼠游戏 - 动物数据配置
export interface Animal {
  letter: string;
  name: string;
  nameEn: string;
  emoji: string;
  sound: string; // 叫声描述
}

export const animals: Animal[] = [
  { letter: "A", name: "蚂蚁", nameEn: "Ant", emoji: "🐜", sound: "吱吱" },
  { letter: "B", name: "熊", nameEn: "Bear", emoji: "🐻", sound: "吼吼" },
  { letter: "C", name: "猫", nameEn: "Cat", emoji: "🐱", sound: "喵喵" },
  { letter: "D", name: "狗", nameEn: "Dog", emoji: "🐕", sound: "汪汪" },
  { letter: "E", name: "大象", nameEn: "Elephant", emoji: "🐘", sound: "呜呜" },
  { letter: "F", name: "青蛙", nameEn: "Frog", emoji: "🐸", sound: "呱呱" },
  { letter: "G", name: "长颈鹿", nameEn: "Giraffe", emoji: "🦒", sound: "嗯嗯" },
  { letter: "H", name: "河马", nameEn: "Hippo", emoji: "🦛", sound: "哼哼" },
  { letter: "I", name: "鬣蜥", nameEn: "Iguana", emoji: "🦎", sound: "嘶嘶" },
  { letter: "J", name: "水母", nameEn: "Jellyfish", emoji: "🪼", sound: "咕噜" },
  { letter: "K", name: "袋鼠", nameEn: "Kangaroo", emoji: "🦘", sound: "咚咚" },
  { letter: "L", name: "狮子", nameEn: "Lion", emoji: "🦁", sound: "嗷呜" },
  { letter: "M", name: "猴子", nameEn: "Monkey", emoji: "🐵", sound: "吱吱" },
  { letter: "N", name: "夜莺", nameEn: "Nightingale", emoji: "🐦", sound: "啾啾" },
  { letter: "O", name: "猫头鹰", nameEn: "Owl", emoji: "🦉", sound: "咕咕" },
  { letter: "P", name: "熊猫", nameEn: "Panda", emoji: "🐼", sound: "哼哼" },
  { letter: "Q", name: "鹌鹑", nameEn: "Quail", emoji: "🐔", sound: "哔哔" },
  { letter: "R", name: "兔子", nameEn: "Rabbit", emoji: "🐰", sound: "咕咕" },
  { letter: "S", name: "蛇", nameEn: "Snake", emoji: "🐍", sound: "嘶嘶" },
  { letter: "T", name: "老虎", nameEn: "Tiger", emoji: "🐯", sound: "嗷呜" },
  { letter: "U", name: "独角兽", nameEn: "Unicorn", emoji: "🦄", sound: "咴咴" },
  { letter: "V", name: "秃鹫", nameEn: "Vulture", emoji: "🦅", sound: "嘎嘎" },
  { letter: "W", name: "鲸鱼", nameEn: "Whale", emoji: "🐋", sound: "嗡嗡" },
  { letter: "X", name: "X射线鱼", nameEn: "X-ray Fish", emoji: "🐟", sound: "咕嘟" },
  { letter: "Y", name: "牦牛", nameEn: "Yak", emoji: "🐄", sound: "哞哞" },
  { letter: "Z", name: "斑马", nameEn: "Zebra", emoji: "🦓", sound: "嘶鸣" },
];

// 文本转 Base64 文件名（用于音频文件）
export function textToFilename(text: string): string {
  const base64 = btoa(unescape(encodeURIComponent(text)));
  return base64.replace(/\//g, '_').replace(/\+/g, '-').replace(/=+$/, '');
}

// 获取随机未出现的动物
export function getRandomAnimal(excludeLetters: string[]): Animal {
  const available = animals.filter(a => !excludeLetters.includes(a.letter));
  return available[Math.floor(Math.random() * available.length)];
}
