import Node from '../Node.js';
import CompileError from '../../utils/CompileError.js';
import rewritePattern from 'regexpu-core';

export default class Literal extends Node {
	initialise () {
		if ( typeof this.value === 'string' ) {
			this.program.indentExclusionElements.push( this );
		}
	}

	transpile ( code, transforms ) {
		if ( transforms.numericLiteral ) {
			const leading = this.raw.slice( 0, 2 );
			if ( leading === '0b' || leading === '0o' ) {
				code.overwrite( this.start, this.end, String( this.value ), {
					storeName: true,
					contentOnly: true
				});
			}
		}

		if ( this.regex ) {
			const { pattern, flags } = this.regex;

			if ( transforms.stickyRegExp && /y/.test( flags ) ) throw new CompileError( 'Regular expression sticky flag is not supported', this );
			if ( transforms.unicodeRegExp && /u/.test( flags ) ) {
				code.overwrite( this.start, this.end, `/${rewritePattern( pattern, flags )}/${flags.replace( 'u', '' )}`, {
					contentOnly: true
				});
			}
		}
	}
}
