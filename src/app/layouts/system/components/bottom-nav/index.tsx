import { useLocation, Link } from 'react-router';
import { cn } from '@/lib/utils';
import { navLinks } from '../sidebar/navlinks-siderbar';

export function MobileBottomNav() {
  const { pathname } = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 h-16 border-t bg-white md:hidden shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
      <div className="grid h-full grid-cols-2">
        {navLinks.map((link) => {
          const isActive = pathname.startsWith(link.href);

          return (
            <Link
              key={link.href}
              to={link.href}
              className={cn(
                'flex flex-col items-center justify-center gap-1 text-xs font-medium transition-colors',
                isActive
                  ? 'text-primary bg-primary/5'
                  : 'text-muted-foreground hover:bg-muted/50'
              )}
            >
              <div
                className={cn('p-1 rounded-full', isActive && 'bg-primary/10')}
              >
                {link.icon}
              </div>
              {link.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
