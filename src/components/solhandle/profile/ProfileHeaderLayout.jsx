export default function ProfileHeaderLayout({ classes, banner, avatar, actions, children }) {
  return <>
    <div className={classes.cover}>{banner}</div>
    <header className={classes.intro}>
      <div className={classes.top}>
        <div className={classes.avatar}>{avatar}</div>
        <div className={classes.actions}>{actions}</div>
      </div>
      {children}
    </header>
  </>;
}