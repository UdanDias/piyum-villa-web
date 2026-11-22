/** Format validation only. Ownership/reachability would require an SMS provider. */
export function phoneError(value:string):string {
 const raw=value.trim();
 const error='Enter a 10-digit Sri Lankan number starting with 0, or an international number with + and its country code.';
 if(!/^[+\d\s()-]+$/.test(raw))return error;
 const compact=raw.replace(/[\s()-]/g,'');
 if(compact.startsWith('+94'))return /^\+94[1-9]\d{8}$/.test(compact)?'':error;
 if(compact.startsWith('+'))return /^\+[1-9]\d{6,14}$/.test(compact)?'':error;
 return /^0[1-9]\d{8}$/.test(compact)?'':error;
}
