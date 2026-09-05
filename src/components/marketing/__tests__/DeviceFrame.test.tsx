import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import axe from "axe-core";
import { DeviceFrame } from "../DeviceFrame";

const shot = (
  <img src="/shot.png" width={1440} height={900} alt="RealtorDesk dashboard" />
);

describe("DeviceFrame", () => {
  it("renders the screenshot it is given", () => {
    const { getByAltText } = render(
      <DeviceFrame variant="laptop">{shot}</DeviceFrame>
    );
    expect(getByAltText("RealtorDesk dashboard")).toBeInTheDocument();
  });

  it("hides its decorative chrome from assistive technology", async () => {
    // The laptop base and phone speaker slot carry no meaning. If they were
    // announced, a screen reader user would hear two unlabelled regions
    // between the heading and the screenshot.
    const { container } = render(
      <>
        <DeviceFrame variant="laptop">{shot}</DeviceFrame>
        <DeviceFrame variant="phone">{shot}</DeviceFrame>
      </>
    );
    const decorative = container.querySelectorAll('[aria-hidden="true"]');
    expect(decorative.length).toBe(2);
  });

  it("introduces no accessibility violations", async () => {
    const { container } = render(
      <DeviceFrame variant="tablet">{shot}</DeviceFrame>
    );
    const r = await axe.run(container, {
      rules: { "color-contrast": { enabled: false } },
    });
    expect(r.violations.map((v) => v.id)).toEqual([]);
  });

  it("clips the screenshot to the screen", () => {
    // Without overflow-hidden the screenshot's square corners poke outside the
    // rounded bezel, which is the tell that a frame is faked.
    const { container } = render(
      <DeviceFrame variant="phone">{shot}</DeviceFrame>
    );
    const screen = container.querySelector(".overflow-hidden");
    expect(screen).toBeTruthy();
    expect(screen?.contains(container.querySelector("img"))).toBe(true);
  });
});
