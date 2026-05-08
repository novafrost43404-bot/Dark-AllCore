import { createEmbed } from '../utils/embeds.js';
import { createSelectMenu, createButton, getPaginationRow } from '../utils/components.js';
import { createAllCommandsMenu } from './helpSelectMenus.js';

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

import {
    Collection,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    MessageFlags,
} from 'discord.js';

import { logger } from '../utils/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const COMMAND_LIST_ID = "help-command-list";
const BACK_BUTTON_ID = "help-back-to-main";
const CATEGORY_SELECT_ID = "help-category-select";
const ALL_COMMANDS_ID = "help-all-commands";
const PAGINATION_PREFIX = "help-page";

const BUG_REPORT_BUTTON_ID = "help-bug-report";

const CATEGORY_ICONS = {
    Core: "⚡",
    Moderation: "🛡️",
    Economy: "💰",
    Fun: "🎮",
    Leveling: "📈",
    Utility: "🔧",
    Ticket: "🎫",
    Welcome: "👋",
    Giveaway: "🎉",
    Counter: "🔢",
    Tools: "🛠️",
    Search: "🔍",
    Reaction_Roles: "🎭",
    Community: "🌍",
    Birthday: "🎂",
    Config: "⚙️",
};

async function createCategorySelectMenu() {

    const commandsPath = path.join(__dirname, "../commands");

    const categoryDirs = (
        await fs.readdir(commandsPath, { withFileTypes: true })
    )
        .filter((dirent) => dirent.isDirectory())
        .map((dirent) => dirent.name)
        .sort();

    const options = [
        {
            label: "📜 All Commands",
            description: "View every available command",
            value: ALL_COMMANDS_ID,
        },

        ...categoryDirs.map((category) => {

            const categoryName =
                category.charAt(0).toUpperCase() +
                category.slice(1).toLowerCase();

            const icon = CATEGORY_ICONS[categoryName] || "✨";

            return {
                label: `${icon} ${categoryName}`,
                description: `View ${categoryName} commands`,
                value: category,
            };
        }),
    ];

    const embed = createEmbed({
        title: "🤖 Apex Bot Help Center",

        description:
            "Advanced Discord bot with moderation, economy, utility, tickets, leveling, giveaways, automation, and community systems.\n\n" +
            "Select a category below to explore all commands.",

        color: "primary",
    });

    embed.addFields(
        {
            name: "🛡️ Moderation",
            value: "Ban, kick, warn, timeout, automod",
            inline: true,
        },
        {
            name: "💰 Economy",
            value: "Coins, work, shop, gambling",
            inline: true,
        },
        {
            name: "🎮 Fun",
            value: "Games, memes, fun commands",
            inline: true,
        },
        {
            name: "📈 Leveling",
            value: "XP, ranks, progression system",
            inline: true,
        },
        {
            name: "🎫 Tickets",
            value: "Support ticket management",
            inline: true,
        },
        {
            name: "🎉 Giveaways",
            value: "Fast giveaway tools",
            inline: true,
        },
        {
            name: "🌍 Community",
            value: "Reaction roles and engagement",
            inline: true,
        },
        {
            name: "🔧 Utility",
            value: "Useful server tools",
            inline: true,
        },
        {
            name: "⚙️ Config",
            value: "Server setup and settings",
            inline: true,
        }
    );

    embed.setFooter({
        text: "Apex Bot • Developed by dark_00.005",
    });

    embed.setTimestamp();

    /*
        BUTTONS
    */

    const bugReportButton = new ButtonBuilder()
        .setCustomId(BUG_REPORT_BUTTON_ID)
        .setLabel("Report Bug")
        .setEmoji("🐛")
        .setStyle(ButtonStyle.Danger);

    const inviteButton = new ButtonBuilder()
        .setLabel("Invite Apex Bot")
        .setStyle(ButtonStyle.Link)
        .setURL(
            "https://discord.com/oauth2/authorize?client_id=YOUR_CLIENT_ID&permissions=8&scope=bot%20applications.commands"
        );

    const buttonRow = new ActionRowBuilder().addComponents([
        bugReportButton,
        inviteButton,
    ]);

    /*
        SELECT MENU
    */

    const selectRow = createSelectMenu(
        CATEGORY_SELECT_ID,
        "Select a category",
        options,
    );

    return {
        embeds: [embed],
        components: [buttonRow, selectRow],
    };
}

/*
    BACK BUTTON
*/

export const helpBackButton = {
    name: BACK_BUTTON_ID,

    async execute(interaction, client) {

        try {

            if (!interaction.deferred && !interaction.replied) {
                await interaction.deferUpdate();
            }

            const { embeds, components } =
                await createCategorySelectMenu();

            await interaction.editReply({
                embeds,
                components,
            });

        } catch (error) {

            if (
                error?.code === 40060 ||
                error?.code === 10062
            ) {

                logger.warn(
                    "Help interaction expired/already acknowledged."
                );

                return;
            }

            logger.error(error);
        }
    },
};

/*
    BUG REPORT BUTTON
*/

export const helpBugReportButton = {
    name: BUG_REPORT_BUTTON_ID,

    async execute(interaction, client) {

        try {

            await interaction.reply({
                content:
                    "🐛 Please type the bug in this channel.\n\n" +
                    "Include:\n" +
                    "• What happened\n" +
                    "• Which command caused it\n" +
                    "• Screenshots if possible\n\n" +
                    "You have 2 minutes.",

                flags: MessageFlags.Ephemeral,
            });

            const filter = (m) =>
                m.author.id === interaction.user.id;

            const collected =
                await interaction.channel.awaitMessages({
                    filter,
                    max: 1,
                    time: 120000,
                });

            if (!collected.size) {

                return interaction.followUp({
                    content:
                        "❌ Bug report timed out.",
                    flags: MessageFlags.Ephemeral,
                });
            }

            const bugMessage = collected.first();

            /*
                CHANGE THIS TO YOUR REAL DISCORD USER ID
            */

            const owner =
                await client.users.fetch(
                    "YOUR_USER_ID"
                );

            const reportEmbed = createEmbed({
                title: "🐛 New Bug Report",
                description: bugMessage.content,
                color: "error",
            });

            reportEmbed.addFields(
                {
                    name: "👤 User",
                    value: interaction.user.tag,
                    inline: true,
                },
                {
                    name: "🏠 Server",
                    value:
                        interaction.guild?.name ||
                        "Direct Messages",
                    inline: true,
                },
                {
                    name: "🆔 User ID",
                    value: interaction.user.id,
                    inline: false,
                }
            );

            reportEmbed.setTimestamp();

            await owner.send({
                embeds: [reportEmbed],
            });

            await interaction.followUp({
                content:
                    "✅ Bug report successfully sent to the developer.",

                flags: MessageFlags.Ephemeral,
            });

        } catch (error) {

            logger.error(error);

            if (!interaction.replied) {

                await interaction.reply({
                    content:
                        "❌ Failed to send bug report.",
                    flags: MessageFlags.Ephemeral,
                });
            }
        }
    },
};

/*
    COMMAND LIST PLACEHOLDER
*/

export const helpReportCommand = {
    name: COMMAND_LIST_ID,
    categoryName: null,

    async execute(interaction, client) {

    },
};

/*
    PAGINATION INFO
*/

function getPaginationInfo(components) {

    for (const row of components || []) {

        for (const component of row.components || []) {

            if (
                component.customId ===
                `${PAGINATION_PREFIX}_page`
            ) {

                const label =
                    component.label || "";

                const match =
                    label.match(
                        /Page\s+(\d+)\s+of\s+(\d+)/i
                    );

                if (match) {

                    return {
                        currentPage:
                            Number(match[1]),

                        totalPages:
                            Number(match[2]),
                    };
                }
            }
        }
    }

    return {
        currentPage: 1,
        totalPages: 1,
    };
}

/*
    PAGINATION BUTTONS
*/

export const helpPaginationButton = {
    name: `${PAGINATION_PREFIX}_next`,

    async execute(interaction, client) {

        try {

            if (
                !interaction.deferred &&
                !interaction.replied
            ) {

                await interaction.deferUpdate();
            }

            const {
                currentPage,
                totalPages,
            } = getPaginationInfo(
                interaction.message?.components
            );

            let nextPage = currentPage;

            switch (interaction.customId) {

                case `${PAGINATION_PREFIX}_first`:
                    nextPage = 1;
                    break;

                case `${PAGINATION_PREFIX}_prev`:
                    nextPage = Math.max(
                        1,
                        currentPage - 1
                    );
                    break;

                case `${PAGINATION_PREFIX}_next`:
                    nextPage = Math.min(
                        totalPages,
                        currentPage + 1
                    );
                    break;

                case `${PAGINATION_PREFIX}_last`:
                    nextPage = totalPages;
                    break;

                default:
                    nextPage = currentPage;
                    break;
            }

            const {
                embeds,
                components,
            } = await createAllCommandsMenu(
                nextPage,
                client
            );

            await interaction.editReply({
                embeds,
                components,
            });

        } catch (error) {

            logger.error(error);
        }
    },
};


