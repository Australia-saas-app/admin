"use client"

import type { ReactNode } from "react"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { PageContainer } from "@/src/shared/components/layout/PageContainer"

interface PublicPageHeroProps {
  title: string
  subtitle?: string
  badge?: string
  action?: ReactNode
  breadcrumbs?: { label: string; href?: string }[]
}

export function PublicPageHero({ title, subtitle, badge, action, breadcrumbs }: PublicPageHeroProps) {
  return (
    <div className="reveal mb-8 rounded-3xl border border-border bg-card p-6 shadow-sm md:p-10">
      <div>
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="mb-4 flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
            {breadcrumbs.map((crumb, i) => (
              <span key={crumb.label} className="flex items-center gap-1">
                {i > 0 && <ChevronRight className="h-3 w-3 opacity-60" />}
                {crumb.href ? (
                  <Link href={crumb.href} className="transition-colors hover:text-primary">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="font-medium text-foreground">{crumb.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}
        {badge && (
          <span className="mb-4 inline-flex rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-primary">
            {badge}
          </span>
        )}
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground md:text-4xl">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
                {subtitle}
              </p>
            )}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      </div>
    </div>
  )
}

interface PublicPageShellProps {
  title: string
  subtitle?: string
  badge?: string
  action?: ReactNode
  breadcrumbs?: { label: string; href?: string }[]
  children: ReactNode
  size?: "sm" | "md" | "lg" | "full"
}

export function PublicPageShell({
  title,
  subtitle,
  badge,
  action,
  breadcrumbs,
  children,
  size = "full",
}: PublicPageShellProps) {
  return (
    <PageContainer size={size} className="pb-12">
      <PublicPageHero
        title={title}
        subtitle={subtitle}
        badge={badge}
        action={action}
        breadcrumbs={breadcrumbs}
      />
      <div className="reveal reveal-delay-1">{children}</div>
    </PageContainer>
  )
}
