import { ScrollReveal } from '../../components/ScrollReveal/ScrollReveal'
import styles from './About.module.css'

const team = [
  { name: 'Алексей Пехов', role: 'Вдохновитель', desc: 'Автор серии «Мастер снов» и создатель уникального мира сновидений в литературе.' },
  { name: 'Наталья Турчанинова', role: 'Соавтор', desc: 'Соавтор серии, привнёсшая в мир снов психологическую глубину и женскую интуицию.' },
  { name: 'Елена Бычкова', role: 'Соавтор', desc: 'Соавтор, создавшая незабываемые образы и поэтический язык мира сновидений.' },
]

export function About() {
  return (
    <main className={styles.main}>
      <div className={styles.hero}>
        <ScrollReveal>
          <p className={styles.eyebrow}>◈ О платформе</p>
          <h1 className={styles.title}>Мир снов</h1>
          <p className={styles.subtitle}>
            Платформа, вдохновлённая серией «Мастер снов» Алексея Пехова,
            Натальи Турчаниновой и Елены Бычковой. Здесь сны — не просто
            ночные видения, а дверь в иное измерение.
          </p>
        </ScrollReveal>
      </div>

      <div className={styles.container}>
        <section className={styles.section}>
          <ScrollReveal>
            <h2 className={styles.sectionTitle}>Наша миссия</h2>
          </ScrollReveal>
          <div className={styles.missionGrid}>
            {[
              { icon: '◐', title: 'Исследование', text: 'Мы изучаем язык снов через психологию, мифологию и литературу.' },
              { icon: '◉', title: 'Практика', text: 'Осознанные сновидения — не мистика, а навык, доступный каждому.' },
              { icon: '◎', title: 'Сообщество', text: 'Место встречи всех, кто слышит шёпот своего подсознания.' },
            ].map((item, i) => (
              <ScrollReveal key={item.title} delay={i * 150}>
                <div className={styles.missionCard}>
                  <div className={styles.missionIcon}>{item.icon}</div>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <ScrollReveal>
            <h2 className={styles.sectionTitle}>Вдохновение</h2>
            <p className={styles.text}>
              Серия «Мастер снов» открыла новый взгляд на мир сновидений:
              не как на случайные образы, а как на живую вселенную со своими
              законами, обитателями и опасностями. Мастера снов — хранители
              этого хрупкого мира. Мы продолжаем их традицию.
            </p>
          </ScrollReveal>
        </section>

        <section className={styles.section}>
          <ScrollReveal>
            <h2 className={styles.sectionTitle}>Авторы вдохновения</h2>
          </ScrollReveal>
          <div className={styles.teamGrid}>
            {team.map((member, i) => (
              <ScrollReveal key={member.name} delay={i * 120} direction="up">
                <div className={styles.teamCard}>
                  <div className={styles.teamAvatar}>
                    {member.name.charAt(0)}
                  </div>
                  <h3 className={styles.teamName}>{member.name}</h3>
                  <p className={styles.teamRole}>{member.role}</p>
                  <p className={styles.teamDesc}>{member.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </section>

        <section className={styles.quoteSection}>
          <ScrollReveal direction="fade">
            <blockquote className={styles.quote}>
              <p>«Между сном и явью нет пропасти. Есть лишь тонкая нить,
              по которой умеет ходить тот, кто знает имя своего сна.»</p>
            </blockquote>
          </ScrollReveal>
        </section>
      </div>
    </main>
  )
}
