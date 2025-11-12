import { useEffect } from 'react';

interface FacebookPagePluginProps {
  pageUrl?: string;
  width?: number;
  height?: number;
  showFacepile?: boolean;
  showPosts?: boolean;
}

const FacebookPagePlugin = ({ 
  pageUrl = "https://www.facebook.com/profile.php?id=61583653411571",
  width = 340,
  height = 500,
  showFacepile = true,
  showPosts = true
}: FacebookPagePluginProps) => {
  
  useEffect(() => {
    // Load Facebook SDK
    if (window.FB) {
      window.FB.XFBML.parse();
    } else {
      const script = document.createElement('script');
      script.src = 'https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v18.0';
      script.async = true;
      script.defer = true;
      script.crossOrigin = 'anonymous';
      document.body.appendChild(script);
    }
  }, []);

  return (
    <div className="facebook-page-plugin">
      <div id="fb-root"></div>
      <div 
        className="fb-page" 
        data-href={pageUrl}
        data-tabs={showPosts ? "timeline" : ""}
        data-width={width}
        data-height={height}
        data-small-header="false"
        data-adapt-container-width="true"
        data-hide-cover="false"
        data-show-facepile={showFacepile}
      >
        <blockquote cite={pageUrl} className="fb-xfbml-parse-ignore">
          <a href={pageUrl}>Follow us on Facebook</a>
        </blockquote>
      </div>
    </div>
  );
};

// Extend Window interface for TypeScript
declare global {
  interface Window {
    FB?: {
      XFBML: {
        parse: () => void;
      };
    };
  }
}

export default FacebookPagePlugin;