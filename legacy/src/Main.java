package ics3uFinal;

import java.util.Scanner;

public class Main {
	public static void main(String[] args) {
		Scanner s = new Scanner(System.in);
		String S = s.next();
		int c = s.nextInt();
		String H = "";
		for (int i=0;i<S.length();i++) {
			if(S.charAt(i) >= 'a' && S.charAt(i) <= 'z') {
				String J = S.substring(i);
				Scanner r = new Scanner(J);
				int x = r.nextInt();
				for(int j=0;j<x;j++) {
					H +=S.charAt(i);
					System.out.println(H);
				}
			}			
		}
		while(H.length()<c) {
			H+=H;
		}
		System.out.println(H.charAt(c));
	}
}