import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { loadFrench } from '@/i18n/config';

const LanguageSwitcher = () => {
  const { i18n, t } = useTranslation();

  const changeLanguage = async (lng: string) => {
    // FR is lazy-loaded; fetch the chunk before switching so the UI doesn't
    // flash EN fallback labels on toggle.
    if (lng.toLowerCase().startsWith('fr')) await loadFrench();
    i18n.changeLanguage(lng);
    // Store preference in localStorage for persistence
    localStorage.setItem('preferred-language', lng);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 font-semibold hover:bg-muted"
          aria-label={t('a11y.changeLanguage', 'Change language')}
        >
          <Globe className="w-4 h-4" />
          <span className="uppercase text-xs font-semibold">
            {i18n.language === 'fr' ? 'FR' : 'EN'}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-background border shadow-lg z-[100]">
        <DropdownMenuItem 
          onClick={() => changeLanguage('en')}
          className={`cursor-pointer ${i18n.language === 'en' ? 'bg-accent text-accent-foreground' : ''}`}
        >
          <span className="mr-2">🇨🇦</span> English
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => changeLanguage('fr')}
          className={`cursor-pointer ${i18n.language === 'fr' ? 'bg-accent text-accent-foreground' : ''}`}
        >
          <span className="mr-2">🇨🇦</span> Français
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;
