export default function Roadmap() {
  return (
    <div>
      <h2>Road map:</h2>
      <ul>
        <li>Make the ui dope:</li>
        <ul>
          <li>Dark mode</li>
          <li>
            Start word on top, end word on bottom, path below start word, and
            next word is on bottom directly above end word. Path is pinned to
            the top, input is pinned to the bottom. Have visual cue that a
            letter needs to be changed.(rick)
          </li>
          <li>Make next word's input box 4 boxes, one for each letter.</li>
        </ul>
        <li>
          Add a secret word that isn't advertised that is similar in subject to
          the starting and ending word. IE if starting word is <code>soap</code>{" "}
          and ending word is <code>dirt</code> a good secret word would be{" "}
          <code>bath</code>. After user finds the secret word display an
          achievement.
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
          <li>
            Upon finishing challenge present how you did compared to other
            users. (melissa)
          </li>
          <li>Total Games Played</li>
          <li>Games Played Consecutively (streak)</li>
          <li>Total Secret words found.</li>
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
          Tutorial: put instructions into a modal that appears when first
          opening the app and is closable.{" "}
        </li>
        <li>
          Share your score: create an image with the day's challenge words along
          with how many words are in your path. (rick)
        </li>
        <li>Make word input 4 individual boxes instead of 1 (rick)</li>
      </ul>
    </div>
  );
}
