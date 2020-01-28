import React from "react";

export default function Musicplayer() {
    return (
        <div className="musicplayer">
            <iframe
                width="100%"
                height="10"
                scrolling="no"
                frameBorder="no"
                allow="autoplay"
                src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/331503119&color=%23ff00c7&auto_play=true&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true"
            ></iframe>
        </div>
    );
}
