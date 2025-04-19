import React from 'react';
// Importação direta dos assets
import logoImg from '../assets/logo_svg.svg';
import neroLogoImg from '../assets/nero.svg';

const LinkGroup = ({ title, links }) => {
  return (
    <div className="min-w-[120px]">
      <h4 className="text-lg font-bold mb-4">{title}</h4>
      {links.map((link, index) => (
        <a
          key={index}
          href={link.url}
          className="block mb-2 text-sm opacity-80 transition-all hover:opacity-100 hover:text-green-400"
        >
          {link.label}
        </a>
      ))}
    </div>
  );
};

const Footer = () => {
  const linkGroups = [
    {
      title: 'Platform',
      links: [
        { label: 'How It Works', url: 'https://miguelclaret.github.io/SeedSafe/' },
        { label: 'For Producers', url: '#producers' },
        { label: 'For Investors', url: '#investors' }
      ]
    },
    {
      title: 'Resources',
      links: [
        { label: 'Documentation', url: 'https://miguelclaret.github.io/SeedSafe/' },
        { label: 'FAQ', url: 'https://x.com/SeedSafe1492878' }
      ]
    },
    {
      title: 'Company',
      links: [
        { label: 'About Us', url: 'https://miguelclaret.github.io/SeedSafe/category/team' },
      ]
    }
  ];

  const socialLinks = [
    { icon: 'fab fa-twitter', url: 'https://x.com/SeedSafe1492878' },
  ];

  return (
    <footer className="bg-slate-900 text-white pt-16 pb-4">
      <div className="container mx-auto px-8">
        <div className="flex flex-wrap justify-between gap-8 mb-12">
          <div className="flex-basis-[250px]">
          <div className="flex items-center gap-2">
        <img src={logoImg} alt="SeedSafe" className="h-10" />
        <span className="font-bold text-3xl">
          Seed<em className="text-green-400 not-italic">Safe</em>
        </span>
      </div>            <p className="text-sm opacity-80 max-w-xs">
              Tokenization of future harvests and carbon credits on NERO Chain
            </p>
          </div>
          
          <div className="flex flex-wrap gap-10">
            {linkGroups.map((group, index) => (
              <LinkGroup
                key={index}
                title={group.title}
                links={group.links}
              />
            ))}
          </div>
          
          <div className="flex-basis-[250px]">
            <h4 className="text-lg font-bold mb-4">Follow Us</h4>
            <div className="flex gap-4 mb-8">
              {socialLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center transition-all hover:bg-green-700"
                >
                  <i className={link.icon}></i>
                </a>
              ))}
            </div>
          </div>
        </div>
        
        <div className="pt-6 border-t border-white/10 flex flex-wrap justify-between items-center gap-4">
          <p className="text-xs opacity-70 mb-0">
            &copy; 2025 SeedSafe. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-xs opacity-70">
            <span>Powered by</span>
            <a 
              href="https://nerochain.io" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:opacity-100 transition-opacity"
            >
              <img src={neroLogoImg} alt="NERO Chain" className="h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;