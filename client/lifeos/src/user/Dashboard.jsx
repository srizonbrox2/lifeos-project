import React from 'react'
import { useState } from 'react'
import './Dashboard.css'

const Dashboard = () => {
  const [goal, setGoal] = useState("")
  const [goal_time, setTime] = useState("")
  const [goalDesc, setGoalDesc] = useState("")
  const [statusMessage, setStatusMessage] = useState("")

  async function FetchingBackendData(event){
    event.preventDefault()

    try {
      const userId = typeof window !== 'undefined' ? localStorage.getItem('user_id') || 'guest' : 'guest'

      const response = await fetch("http://127.0.0.1:8000/goal_fetch", {
        method: "POST",
        headers:{
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "username": userId,
          "goal": goal,
          "goal_desc": goalDesc,
          "goal_time": goal_time
        })
      })
      const data = await response.json()
      if (data.status){
        setStatusMessage("Goal saved successfully.")
        setGoal("")
        setGoalDesc("")
        setTime("")
      }
      else{
        setStatusMessage(data.message || "An error occurred")
      }
    } catch (error) {
      setStatusMessage("Unable to reach the server.")
    }
  }
  const userId = typeof window !== 'undefined' ? localStorage.getItem('user_id') || 'guest' : 'guest'

  const progressItems = [
    { label: 'Personal Growth', value: 82 },
    { label: 'Work Momentum', value: 74 },
    { label: 'Learning Focus', value: 91 },
  ]

  const timeline = [
    'Morning reflection and priorities set for the day.',
    'Deep work block completed with strong focus.',
    'Evening review highlights the next growth milestone.',
  ]

  const suggestions = [
    { icon: '✨', title: 'AI coaching', text: 'Try a 20-minute sprint to sharpen your top skill.' },
    { icon: '📈', title: 'Data pulse', text: 'Your consistency trend is outperforming last month.' },
    { icon: '🧠', title: 'Mindset boost', text: 'A short reset can turn a tough task into a win.' },
  ]

  return (
    <div className="dashboard-page">
      <div className="dashboard-shell">
        <section className="dashboard-hero">
          <div className="hero-card">
            <form className="GoalInput" onSubmit={FetchingBackendData}>
              <div className="goalInput">
                <input type="text" name="goal_Input" id="goal_input" placeholder='Enter your goal' value={goal} onChange={(e)=> setGoal(e.target.value)}/>
              </div>
              <div className="goal">
                <input type="text" name="goal_desc" id="goal_desc" placeholder='Goal description here' value={goalDesc} onChange={(e) => setGoalDesc(e.target.value)} />
              </div>
              <div className="goalTime">
                <input type="text" name="time_input" id="time_input" placeholder='Enter time here' value={goal_time} onChange={(e) => setTime(e.target.value)} />
              </div>
              <button type="submit">Set Goal</button>
              {statusMessage ? <p className="muted">{statusMessage}</p> : null}
            </form>
            <div className="hero-content">
              <span className="hero-kicker">Your life dashboard</span>
              <h2 className="hero-title">Your growth, work, and next smart steps are ready.</h2>
              <p className="hero-copy">
                Track the big picture in one place with progress insights, AI guidance, and meaningful daily momentum.
              </p>
              <div className="hero-actions">
                <button className="hero-btn" type="button">Review today</button>
                <button className="ghost-btn" type="button">Plan next week</button>
              </div>
            </div>
          </div>

          <div className="info-card">
            <span className="info-label">This week</span>
            <div className="info-value">+18% energy</div>
            <div className="info-sub">You are building consistency faster than expected, and your focus is trending upward.</div>
          </div>
        </section>

        <section className="metric-grid">
          <div className="metric-card">
            <strong>7.4h</strong>
            <span>Deep work this week</span>
          </div>
          <div className="metric-card">
            <strong>4/5</strong>
            <span>Habits completed</span>
          </div>
          <div className="metric-card">
            <strong>12</strong>
            <span>Ideas captured</span>
          </div>
          <div className="metric-card">
            <strong>93%</strong>
            <span>Wellness balance</span>
          </div>
        </section>

        <section className="dashboard-grid">
          <div className="section-card">
            <div className="section-title-row">
              <h3 className="section-title">Progress overview</h3>
              <span className="muted">Steady and strong</span>
            </div>

            <div className="progress-stack">
              {progressItems.map((item) => (
                <div className="progress-item" key={item.label}>
                  <div className="progress-label">
                    <span>{item.label}</span>
                    <strong>{item.value}%</strong>
                  </div>
                  <div className="progress-track">
                    <div className="progress-fill" style={{ width: `${item.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="section-card ai-card">
            <div className="section-title-row">
              <h3 className="section-title">AI guidance</h3>
              <span className="ai-pill">smart insight</span>
            </div>
            <div className="ring-wrap">
              <div className="ring" style={{ '--progress': 84 }}>
                <div className="ring-inner">
                  <strong>84%</strong>
                  <span>ready</span>
                </div>
              </div>
              <div className="muted">
                Your goals are aligned. The next best step is to protect one uninterrupted hour for your biggest priority.
              </div>
            </div>
          </div>
        </section>

        <section className="dashboard-grid">
          <div className="section-card">
            <div className="section-title-row">
              <h3 className="section-title">Daily flow</h3>
              <span className="muted">Momentum map</span>
            </div>
            <div className="timeline-list">
              {timeline.map((item, index) => (
                <div className="timeline-item" key={item}>
                  <div className="timeline-dot" />
                  <div>
                    <strong>Step {index + 1}</strong>
                    <div className="muted">{item}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="section-card">
            <div className="section-title-row">
              <h3 className="section-title">Suggestions</h3>
              <span className="muted">Personalized</span>
            </div>
            <div className="suggestion-list">
              {suggestions.map((item) => (
                <div className="suggestion-item" key={item.title}>
                  <div className="suggestion-icon">{item.icon}</div>
                  <div>
                    <strong>{item.title}</strong>
                    <div className="muted">{item.text}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section-card">
          <div className="section-title-row">
            <h3 className="section-title">Focus pulse</h3>
            <span className="muted">Last 6 days</span>
          </div>
          <div className="spark-grid">
            <div className="spark-row">
              <span>Weekly rhythm</span>
              <strong>Strong</strong>
            </div>
            <div className="bar-chart">
              {[52, 68, 74, 81, 77, 91].map((height, index) => (
                <div className="bar" key={index} style={{ height: `${height}%` }} />
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Dashboard
