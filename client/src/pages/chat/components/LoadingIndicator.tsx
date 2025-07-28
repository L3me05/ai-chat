
function LoadingIndicator() {
    return (
        <>
          <div className="message ai-message">
              <div className="message-avatar">AI</div>
              <div className="message-content flex gap-2.5 items-center">
                  <span className="w-2 h-2 rounded-full bg-secondary animate-pulseDot"></span>
                  <span className="w-2 h-2 rounded-full bg-secondary animate-pulseDot [animation-delay:0.2s]"></span>
                  <span className="w-2 h-2 rounded-full bg-secondary animate-pulseDot [animation-delay:0.2s]"></span>
              </div>
          </div>
        </>
    );
}

export default LoadingIndicator;