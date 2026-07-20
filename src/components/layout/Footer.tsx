import React from 'react';
import Link from 'next/link';
import { Github, Mail, Globe, Cpu } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="w-full border-t border-[#E1E4EA] bg-white text-[#6B7280]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-[#181B20] font-bold font-display">
              <Cpu className="h-5 w-5 text-[#4F46E5]" />
              <span>Archflow</span>
            </div>
            <p className="text-sm">
              AI Software Architect: translating single paragraph software ideas
              into system designs, checklists, and code stubs.
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-sm font-semibold text-[#181B20] uppercase tracking-wider mb-4 font-display">
              Product
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/blueprints"
                  className="hover:text-[#181B20] transition-colors"
                >
                  Explore Blueprints
                </Link>
              </li>
              <li>
                <Link
                  href="/workspace"
                  className="hover:text-[#181B20] transition-colors"
                >
                  Workspace
                </Link>
              </li>
              <li>
                <Link
                  href="/docs"
                  className="hover:text-[#181B20] transition-colors"
                >
                  Documentation
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-sm font-semibold text-[#181B20] uppercase tracking-wider mb-4 font-display">
              Company
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/about"
                  className="hover:text-[#181B20] transition-colors"
                >
                  About Archflow
                </Link>
              </li>
              <li>
                <Link
                  href="https://github.com"
                  target="_blank"
                  className="hover:text-[#181B20] transition-colors"
                >
                  GitHub Repos
                </Link>
              </li>
            </ul>
          </div>

          {/* Social / Contact */}
          <div>
            <h3 className="text-sm font-semibold text-[#181B20] uppercase tracking-wider mb-4 font-display">
              Contact & Socials
            </h3>
            <div className="flex space-x-4 mb-4">
              <Link
                href="https://github.com"
                target="_blank"
                className="hover:text-[#181B20] transition-colors"
              >
                <Github className="h-5 w-5" />
              </Link>
              <Link
                href="https://mahmudulhasan-dev.vercel.app"
                target="_blank"
                className="hover:text-[#181B20] transition-colors"
              >
                <Globe className="h-5 w-5" />
              </Link>
              <Link
                href="mailto:support@archflow.com"
                className="hover:text-[#181B20] transition-colors"
              >
                <Mail className="h-5 w-5" />
              </Link>
            </div>
            <p className="text-xs">Email: support@archflow.com</p>
          </div>
        </div>

        <div className="mt-8 border-t border-[#E1E4EA] pt-8 flex flex-col md:flex-row justify-between items-center text-xs">
          <p>
            &copy; {new Date().getFullYear()} Archflow. All rights reserved.
          </p>
          <div className="flex gap-4 mt-4 md:mt-0 font-medium">
            <span>Built by Mahmudul Hasan with ❤️</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
