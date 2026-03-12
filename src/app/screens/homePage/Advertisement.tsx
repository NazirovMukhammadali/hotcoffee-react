import React from "react";

export default function Advertisement() {
    return (
        <div className="ads-restaurant-frame">
            <video className="ads-video"
                autoPlay={true}
                loop
                muted
                playsInline
                data-video-media=""
            >
                <source type="video/mp4" src="video/hotcoffee.mp4" />
            </video>
        </div>
    )
}
