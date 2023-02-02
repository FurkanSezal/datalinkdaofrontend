import { ConnectButton } from "@web3uikit/web3";
import Link from "next/link";

export default function Header() {
  return (
    <nav>
      <ConnectButton moralisAuth={false} />
    </nav>
  );
}
