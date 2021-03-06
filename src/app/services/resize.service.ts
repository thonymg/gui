import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

export interface Breakpoint {
	label: string;
	minWidth: number;
	maxWidth: number;
}

@Injectable({
	providedIn: 'root',
})
export class ResizeService {
	wait = new Subject<void>();
	resizeEnd = new Subject<void>();
	breakpointChanges = new Subject<{
		previous: Breakpoint;
		current: Breakpoint;
		evolution: 'shrink' | 'grow';
	}>();

	breakpoints: Breakpoint[] = [
		{
			label: 'xs',
			minWidth: 0,
			maxWidth: 576,
		},
		{
			label: 'sm',
			minWidth: 576,
			maxWidth: 768,
		},
		{
			label: 'md',
			minWidth: 768,
			maxWidth: 992,
		},
		{
			label: 'lg',
			minWidth: 992,
			maxWidth: 1200,
		},
		{
			label: 'xl',
			minWidth: 1200,
			maxWidth: Number.MAX_SAFE_INTEGER,
		},
	];
	currentBreakpoint: Breakpoint = this.getCurrentBreakpoint();

	constructor() {
		window.addEventListener('resize', () => {
			this.wait.next();
		});

		this.wait.pipe(debounceTime(50)).subscribe(() => {
			const breakPoint = this.breakpoints.find((b) => window.innerWidth >= b.minWidth && window.innerWidth < b.maxWidth);
			if (this.currentBreakpoint.label !== breakPoint.label) {
				this.breakpointChanges.next({
					previous: this.currentBreakpoint,
					current: breakPoint,
					evolution: this.currentBreakpoint.minWidth > breakPoint.minWidth ? 'shrink' : 'grow',
				});
				this.currentBreakpoint = breakPoint;
			}
			this.resizeEnd.next();
		});
	}

	getCurrentBreakpoint(): Breakpoint {
		return this.breakpoints.find((b) => window.innerWidth > b.minWidth && window.innerWidth <= b.maxWidth);
	}
}
