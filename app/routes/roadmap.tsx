export default function Roadmap() {
  return (
    <div>
      <h2>Road map:</h2>
      <ul>
        <li>
          Add a secret word that isn't advertised that is similar in subject to
          the starting and ending word. IE if starting word is <code>soap</code>{" "}
          and ending word is <code>dirt</code> a good secret word would be{" "}
          <code>bath</code>
        </li>
        <li>
          Display that challenge's shortest path, perhaps after they finished
          their first round? Or just do it from the get go.
        </li>
        <li>
          Implement user Authentication and maintain the following statistics
          for each user:
        </li>
        <ul>
          <li>Total Games Played</li>
          <li>Games Played Consecutively (streak)</li>
          <li>
            Total Secret (Elyssa) words found: for each challenge have a secret
            word that is related to the two words for the day. Present a badge
            if the user finds it.
          </li>
          <li>
            Total times the user got the shortest path found for that day's
            challenge
          </li>
        </ul>
        <li>
          Maintain statistics on most popular paths for each challenge. This
          *may* be interesting to look at in the future and display.
        </li>
        <li>
          Make the ui dope. Reference wordle's design: dark mode, intuitive,
          ease of use, etc.
        </li>
        <li>
          Tutorial: put instructions into a modal that appears when first
          opening the app and is closable.{" "}
        </li>
      </ul>
    </div>
  );
}
