const photos = {
  hero: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=85",
  beach: "https://images.unsplash.com/photo-1507520425957-5ad9956d5c7a?auto=format&fit=crop&w=900&q=85",
  coffee: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=85",
};

function SparkIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true" className="icon-spark"><path d="m12 2 1.35 6.65L20 10l-6.65 1.35L12 18l-1.35-6.65L4 10l6.65-1.35L12 2Z" /><path d="m19 16 .58 2.42L22 19l-2.42.58L19 22l-.58-2.42L16 19l2.42-.58L19 16Z" /></svg>;
}

function ArrowIcon() {
  return <svg viewBox="0 0 20 20" aria-hidden="true" className="arrow-icon"><path d="M3 10h13M11 4l6 6-6 6" /></svg>;
}

function HeartIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true" className="feed-icon"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z" /></svg>;
}

function ChatIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true" className="feed-icon"><path d="M20.5 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.2A8.38 8.38 0 0 1 4 12a8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 7.5 7.5v.5Z" /></svg>;
}

function BookmarkIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true" className="feed-icon"><path d="M5 4.5A2.5 2.5 0 0 1 7.5 2h9A2.5 2.5 0 0 1 19 4.5V22l-7-4-7 4V4.5Z" /></svg>;
}

function Avatar({ label, tone }: { label: string; tone: string }) {
  return <span className={`avatar ${tone}`} aria-label={`${label}'s avatar`}>{label.slice(0, 1)}</span>;
}

export default function Home() {
  return (
    <main className="site-shell">
      <nav className="topbar" aria-label="Main navigation">
        <a className="brand" href="#top" aria-label="morrow home"><span className="brand-mark"><SparkIcon /></span><span>morrow</span></a>
        <div className="nav-links"><a href="#why-morrow">Why morrow</a><a href="#community">Community</a></div>
        <a className="nav-login" href="#signup">Log in <ArrowIcon /></a>
      </nav>

      <section className="hero" id="top">
        <div className="hero-copy">
          <div className="eyebrow"><span className="eyebrow-dot" />A little more human</div>
          <h1>Share what makes<br /><em>today</em> worth it.</h1>
          <p className="hero-intro">A calm corner of the internet for the people, places, and tiny moments you want to remember.</p>
          <div className="hero-actions" id="signup"><a className="button button-primary" href="#join">Create your space <ArrowIcon /></a><a className="button button-quiet" href="#why-morrow">See how it works <span className="play">▶</span></a></div>
          <div className="member-note"><div className="avatar-stack" aria-hidden="true"><Avatar label="L" tone="avatar-lilac" /><Avatar label="M" tone="avatar-sand" /><Avatar label="A" tone="avatar-rose" /><Avatar label="J" tone="avatar-mint" /></div><span>Join 18,000+ people making room for the good stuff.</span></div>
        </div>

        <div className="hero-visual" aria-label="A preview of the morrow social feed">
          <div className="sun-orb" /><div className="scribble scribble-one">✳</div><div className="scribble scribble-two">✦</div><div className="phone-shadow" />
          <div className="phone">
            <div className="phone-notch" /><div className="phone-header"><span>morrow</span><span className="header-menu">•••</span></div>
            <div className="story-row"><div className="story"><span className="story-ring"><Avatar label="You" tone="avatar-you" /></span><small>Your story</small></div><div className="story"><span className="story-ring"><Avatar label="S" tone="avatar-sky" /></span><small>samira</small></div><div className="story"><span className="story-ring"><Avatar label="N" tone="avatar-coral" /></span><small>noah</small></div><div className="story"><span className="story-ring"><Avatar label="R" tone="avatar-leaf" /></span><small>riley</small></div></div>
            <article className="feed-card">
              <div className="feed-user"><Avatar label="S" tone="avatar-sky" /><div><strong>samira.rose</strong><small>Lisbon, PT</small></div><span className="more">•••</span></div>
              <div className="feed-image" style={{ backgroundImage: `url(${photos.hero})` }} />
              <div className="feed-actions"><span><HeartIcon /><ChatIcon /></span><BookmarkIcon /></div><strong className="likes">248 likes</strong><p><strong>samira.rose</strong> sunday light and a slow morning ☀️</p><small className="comments">View all 18 comments</small>
            </article>
          </div>
          <div className="floating-note"><span>☀</span><div><strong>slow moments</strong><small>are still moments</small></div></div>
        </div>
      </section>

      <section className="brand-strip" aria-label="Community quote"><span className="strip-line" /><p>“The place I go when I want the internet to feel like a window, not a wall.”</p><span className="strip-name">— maya, early member</span><span className="strip-line" /></section>

      <section className="feature-section" id="why-morrow">
        <div className="section-heading"><div className="eyebrow"><span className="eyebrow-dot" />Made for real life</div><h2>Less noise.<br /><em>More you.</em></h2><p>Morrow is built around the way connection should feel: curious, personal, and pleasantly unhurried.</p></div>
        <div className="feature-grid">
          <article className="feature-card feature-card-tall"><div className="feature-photo" style={{ backgroundImage: `url(${photos.beach})` }}><span className="photo-label">little escapes</span></div><div className="feature-content"><span className="feature-number">01</span><h3>Your feed, your pace.</h3><p>See the people you care about, in the order they shared it. No endless scroll required.</p></div></article>
          <article className="feature-card feature-card-sun" id="community"><div className="sun-doodle">✺</div><span className="feature-number">02</span><h3>Keep the small things.</h3><p>Save a thought, a photo, or a feeling. Your personal archive of ordinary magic.</p><a href="#join" className="text-link">Make a little room <ArrowIcon /></a></article>
          <article className="feature-card feature-card-wide"><div className="wide-photo" style={{ backgroundImage: `url(${photos.coffee})` }} /><div className="wide-copy"><span className="feature-number">03</span><h3>Find your people.</h3><p>Discover thoughtful corners and kindred spirits without performing for the algorithm.</p></div></article>
        </div>
      </section>

      <section className="join-section" id="join"><div className="join-orbit orbit-left" /><div className="join-orbit orbit-right" /><div className="eyebrow eyebrow-light"><span className="eyebrow-dot" />Your next chapter starts here</div><h2>Bring your <em>good stuff.</em></h2><p>Make a space that feels like you. It takes less than a minute.</p><a className="button button-light" href="#top">Join morrow <ArrowIcon /></a></section>
      <footer className="footer"><a className="brand" href="#top"><span className="brand-mark"><SparkIcon /></span><span>morrow</span></a><span>© 2026 morrow, made for the in-between.</span><div><a href="#why-morrow">About</a><a href="#community">Community</a><a href="#signup">Log in</a></div></footer>
    </main>
  );
}
