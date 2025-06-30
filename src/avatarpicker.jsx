import React from "react";

function AvatarPicker({ onAvatarSelect }) {
  const avatars = [
    "😀", "😎", "🧙‍♀️", "🦄", "🍕", "🐶", "🐱", "🦁",
    "🐮", "🐷", "🐸", "🐵", "🦊", "🐻", "🐼", "🦋",
    "🐞", "🐙", "🦑", "🦀", "🐳", "🦕", "🦖"
  ];

  return (
    <>
    
    
                     <div class="panel">
                
                
                <div class="input-group">
                    <label>🎭 Your Emoji Avatar</label>
                    <div class="emoji-avatar tooltip" id="emojiAvatar" title="Click to edit">
                        🧙‍♀️🦄🍕
                        <span class="tooltiptext">Click to change your avatar!</span>
                    </div>
                </div>
            </div>

                    </>
  );
}
export default AvatarPicker;